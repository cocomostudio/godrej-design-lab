
/**
 |
 | The website's HTTP server.
 |
 | This replaces `react-router-serve`, whose behaviour it reproduces: the same
 | middleware in the same order, the same cache lifetimes on the same
 | directories, the same port, the same signal handling. Nothing a visitor can
 | observe changes by owning it.
 |
 | We own it so that the responses are ours to shape. The stock server accepts
 | no header configuration and serves static assets through its own static
 | handler, so headers set at the document-rendering layer would miss every
 | asset — precisely where a MIME-sniffing directive matters. See the decision
 | record: docs/decisions/00001-website-serves-its-own-responses.md.
 |
 | Run directly by Node, not bundled — hence the explicit `.ts` extensions on
 | relative imports.
 |
 */

import type { ViteDevServer } from "vite"
import type Express from "express"

import path from "node:path"

import express from "express"
import compression from "compression"
import morgan from "morgan"
import { createRequestHandler } from "@react-router/express"

import { Environment } from "../environment/index.ts"
import { register_security_headers_middleware } from "./security-headers.ts"

const APP_ROOT = path.resolve( import.meta.dirname, "..", ".." )

export const WebServer = {
	/**
	 |
	 | The configured Express application, not yet listening.
	 |
	 | Separate from `init` so that it can be driven over HTTP on a port of the
	 | operating system's choosing, rather than reassembling a second server
	 | that would then be the thing under test.
	 |
	 */
	async build () {
		const express_app = build_express_server()
		configure_express_server( express_app )

		if ( Environment.get( "SERVE_MODE" ) === Environment.SERVE_MODES.VITE ) {
			const vite_dev_server = await build_vite_server()
			register_vite_middleware( express_app, vite_dev_server )
			register_logging_middleware( express_app )
			register_react_router_middleware( express_app, vite_dev_server )
		}
		else {
			const build = await load_server_build()
			register_static_middleware( express_app, build )
			register_logging_middleware( express_app )
			register_react_router_middleware_from_build( express_app, build )
		}

		return express_app
	},

	async init () {
		start_listening( await WebServer.build() )
	},
}

function build_express_server () {
	return express()
}

function configure_express_server ( express_app: Express.Application ) {
	express_app.disable( "x-powered-by" )
	// ↑ Express announces itself in `X-Powered-By` by default. One of the two
	// 	banner disclosures the VAPT report found; the other is nginx's, and is
	// 	suppressed at the proxy.

	express_app.use( compression() )
	// ↑ What `react-router-serve` did. nginx does not gzip for this host yet,
	// 	so removing it would be a bandwidth regression rather than a tidy-up.

	register_security_headers_middleware( express_app )
	// ↑ **Above everything that can answer a request**, which is the only
	// 	position that works: the static mounts and Vite's middleware both end
	// 	the chain themselves, so anything registered below them never runs for
	// 	an asset. Assets are exactly where `nosniff` matters. See
	// 	`security-headers.ts`.
}

/**
 |
 | `react-router-serve` logs after its static mounts, so an asset request never
 | reaches the logger. Registered at the same point here, for the same reason:
 | a request log that is one line per asset is a request log nobody reads.
 |
 */
function register_logging_middleware ( express_app: Express.Application ) {
	express_app.use( morgan( "tiny" ) )
}

async function build_vite_server () {
	return await import( "vite" ).then( ( vite ) =>
		// ↑ Dynamic import, so this whole branch is skipped in production.
		vite.createServer( {
			root: APP_ROOT,
			server: { middlewareMode: true },
			// ↑ Tells Vite not to create its own HTTP server. It exposes a
			// 	`.middlewares` property instead, which plugs into Express.
		} )
	)
}

function register_vite_middleware (
	express_app: Express.Application,
	vite_dev_server: ViteDevServer,
) {
	express_app.use( vite_dev_server.middlewares )
}

function register_react_router_middleware (
	express_app: Express.Application,
	vite_dev_server: ViteDevServer,
) {
	express_app.all(
		"*",
		createRequestHandler( {
			build: () => vite_dev_server.ssrLoadModule(
				"virtual:react-router/server-build",
			) as any,
			// ↑ `build` is a factory, called on every request, so a loader edit
			// 	is visible without restarting the server. `ssrLoadModule` is
			// 	typed as returning an arbitrary module record, which is all Vite
			// 	can promise; the virtual module it resolves is the server build.
			mode: Environment.ENVIRONMENTS.DEVELOPMENT,
		} ),
	)
}

function register_react_router_middleware_from_build (
	express_app: Express.Application,
	build: any,
) {
	express_app.all(
		"*",
		createRequestHandler( {
			build,
			mode: Environment.get( "APP_ENV" ),
		} ),
	)
}

function load_server_build () {
		// Not a literal, so TypeScript does not try to resolve a path that only
		// exists after `react-router build` has run.
	const build_path = "../../build/server/index.js"
	return import( build_path )
}

/**
 |
 | The three static mounts `react-router-serve` applies, in its order and with
 | its cache lifetimes.
 |
 | Fingerprinted assets are immutable for a year; everything else in the client
 | build carries Express's default (no `max-age`, revalidated by ETag). The
 | third mount is stock's belt and braces — `react-router build` has already
 | copied `public/` into the client build, so it is reached only by a file that
 | arrived on the host afterwards.
 |
 | The directories come from the build itself rather than from configuration,
 | because `react-router.config.ts` already decides where they are.
 |
 */
function register_static_middleware (
	express_app: Express.Application,
	build: any,
) {
	const client_build_dir = path.resolve(
		APP_ROOT,
		build.assetsBuildDirectory,
	)

	express_app.use(
		path.posix.join( build.publicPath, "assets" ),
		express.static( path.join( client_build_dir, "assets" ), {
			immutable: true,
			maxAge: "1y",
		} ),
	)
	express_app.use( build.publicPath, express.static( client_build_dir ) )
	express_app.use( express.static(
		path.resolve( APP_ROOT, "public" ),
		{ maxAge: "1h" },
	) )
}

function start_listening ( express_app: Express.Application ) {
	const port = Environment.get( "HTTP_SERVER_PORT" )

	const server = express_app.listen( port, () => {
		console.log( `HTTP server is up and running on http://localhost:${ port }` )
	} )

	for ( const signal of [ "SIGTERM", "SIGINT" ] ) {
		process.once( signal, () => {
			server.close()
		} )
	}
}
