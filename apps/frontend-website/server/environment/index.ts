
/**
 |
 | Server environment.
 |
 | Read once at module evaluation. ESM guarantees this settles before any
 | importer's code runs, so there is no setup ordering to get wrong.
 |
 | `process.env` is touched here and nowhere else in the running application.
 | The one other reader is `src/routes.ts`, which is evaluated by Vite at build
 | and config time in a process that is not this server.
 |
 | Which file populated it is decided by the `package.json` script — `dev` reads
 | `.env`, `start` reads `.env.production` — and not by anything here.
 |
 */

const ENVIRONMENTS = {
	DEVELOPMENT: "development",
	PRODUCTION: "production",
} as const

type ApplicationEnvironment = typeof ENVIRONMENTS[ keyof typeof ENVIRONMENTS ]

/**
 |
 | How the browser's assets are produced and served.
 |
 | `vite` mounts a Vite development server in this process — transforming on
 | demand, with hot module replacement. `static` serves what
 | `react-router build` already wrote.
 |
 */
const SERVE_MODES = {
	VITE: "vite",
	STATIC: "static",
} as const

type ServeMode = typeof SERVE_MODES[ keyof typeof SERVE_MODES ]

type Env = {
	APP_ENV: ApplicationEnvironment
	CMS_URL: string
	CMS_PUBLIC_URL: string
	CMS_HOST_NAME: string
	PREVIEW_LINK_SECRET: string
	SERVE_MODE: ServeMode
	HTTP_SERVER_PORT: number
}

/**
 |
 | The CMS's origin **as this server reaches it**.
 |
 | A default is carried here, unlike the secret, which has none: this one names
 | a machine rather than granting access, and a deployment that forgets it
 | fails on the first page with a connection error rather than quietly working
 | with something insecure.
 |
 | Only this process ever dials it, so it is free to be an address only this
 | process can resolve — a loopback port, a private host inside the VPC.
 |
 */
const cms_url = process.env.CMS_URL ?? "http://localhost:1337"

const application_environment = read_application_environment()

const _env: Env = {
	APP_ENV: application_environment,
	CMS_URL: cms_url,
	/**
	 |
	 | The CMS's origin **as a browser reaches it**, which is a different
	 | question and frequently a different answer: in production `CMS_URL` is a
	 | private address inside the VPC, and a visitor's browser cannot resolve
	 | that. This is the one that goes in front of every `/uploads/…` path the
	 | CMS hands back, and ends up in an `src` attribute in someone else's
	 | browser.
	 |
	 | Unset, it falls back to `CMS_URL` — which is right in development, where
	 | the two are the same machine and the same address.
	 |
	 | Mostly a fallback in production: the S3 upload provider returns absolute
	 | CDN URLs, and `media_url()` passes absolute URLs through untouched. It is
	 | what catches an upload still carrying a relative path from before S3.
	 |
	 */
	CMS_PUBLIC_URL: process.env.CMS_PUBLIC_URL ?? cms_url,
	/**
	 |
	 | The name the CMS answers to, when the address in `CMS_URL` is not one.
	 |
	 | Sent as the `Host` header, and as the TLS server name so the certificate
	 | still matches. Unset, the request carries the `Host` its address implies,
	 | which is right wherever the CMS is the only thing listening — a
	 | developer's machine, or a deployment with a name of its own.
	 |
	 */
	CMS_HOST_NAME: process.env.CMS_HOST_NAME ?? "",
	/**
	 |
	 | Signs the preview links the CMS hands an editor, and which this server
	 | verifies before it will ask the CMS for unpublished content.
	 |
	 | **No default, deliberately.** A fallback here would be a shared secret
	 | somebody could ship without meaning to — and the failure it prevents,
	 | unpublished content readable by anyone who guesses a query parameter, is
	 | not one anybody notices from outside.
	 |
	 | Must equal `PREVIEW_SECRET` in the CMS's env file. The two are on
	 | different machines and nothing reconciles them.
	 |
	 */
	PREVIEW_LINK_SECRET: process.env.PREVIEW_LINK_SECRET ?? "",
	/**
	 |
	 | Whether this process builds the browser's assets or merely serves them.
	 |
	 | Its own variable rather than a reading of the environment, because the
	 | wrong answer here is expensive in both directions. The website host's
	 | process manager declares `NODE_ENV: "development"` in its base
	 | environment, so a `pm2 start` that forgets `--env production` would
	 | otherwise start a Vite development server against source on the
	 | production host.
	 |
	 | The environment supplies only the default: built assets in production, a
	 | Vite server everywhere else.
	 |
	 */
	SERVE_MODE: read_serve_mode( process.env.SERVE_MODE ),
	/**
	 |
	 | The port the Express server listens on.
	 |
	 | 3000 is what `react-router-serve` settled on and what nginx already
	 | proxies to on the website host, so the default is what keeps the host's
	 | configuration untouched.
	 |
	 */
	HTTP_SERVER_PORT: read_port( process.env.HTTP_SERVER_PORT, 3000 ),
}

export const Environment = {
	get,
	ENVIRONMENTS,
	SERVE_MODES,
}

function get<T extends keyof Env> ( key: T ): Env[ T ] {
	return _env[ key ]
}

function read_application_environment (): ApplicationEnvironment {
	const raw = process.env.APP_ENV ?? process.env.NODE_ENV
	return raw === ENVIRONMENTS.PRODUCTION
		? ENVIRONMENTS.PRODUCTION
		: ENVIRONMENTS.DEVELOPMENT
}

/**
 |
 | Unset and empty both mean unset, so a deployment can hand the decision back
 | to the environment by emptying the variable rather than by deleting the line.
 |
 | **Refuses the boot on an unrecognised value**, unlike `read_port`, which
 | falls back. The asymmetry is deliberate: a port that cannot be parsed is
 | visible on the first request, whereas a misspelt serve mode read as its
 | default is not visible at all — the override silently did not take, and every
 | symptom afterwards points somewhere other than the typo.
 |
 */
function read_serve_mode ( raw: string | undefined ): ServeMode {
	if ( raw === undefined || raw === "" ) {
		return application_environment === ENVIRONMENTS.PRODUCTION
			? SERVE_MODES.STATIC
			: SERVE_MODES.VITE
	}

	if ( raw === SERVE_MODES.VITE || raw === SERVE_MODES.STATIC ) {
		return raw
	}

	throw new Error(
		`SERVE_MODE is "${ raw }", which is neither "${ SERVE_MODES.VITE }" nor `
		+ `"${ SERVE_MODES.STATIC }". Set it to one of those, or empty it to `
		+ `let the environment decide.`,
	)
}

function read_port ( raw: string | undefined, fallback: number ) {
	const parsed = Number.parseInt( raw ?? "", 10 )
	return Number.isInteger( parsed ) ? parsed : fallback
}
