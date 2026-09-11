
/**
 |
 | The middleware chain, in the order a request runs through it.
 |
 | Most of this is Strapi's stock chain. Four entries are the CMS's half of
 | the VAPT remediation, and are the reason this file is worth reading:
 |
 | * `global::no-store` — first, so that nothing downstream can overwrite
 |   the cache directive it sets on the way out.
 | * `strapi::security` — helmet. Carries HSTS, nosniff, a referrer policy
 |   and the content security policy.
 | * `strapi::cors` — no longer "any origin on the Internet may read this".
 | * `strapi::poweredBy` — **absent**, deliberately. See below.
 |
 | Ticket: `02-cms-response-hardening` under
 | `__this-project/build-plans/2026-09-11__vapt-remediation/tickets/`.
 |
 */

/**
 |
 | Reads one value out of the host's environment file, with a fallback.
 |
 | Strapi hands this in. Declared here only so that every function in the
 | file can name the same type for it.
 |
 */
type Env = ( key: string, fallback?: string ) => string

const ONE_YEAR_IN_SECONDS = 31536000

export default function ( { env }: { env: Env } ) {
	return [
		"global::no-store",
		"strapi::logger",
		"strapi::errors",
		{
			name: "strapi::security",
			config: security_configuration( env ),
		},
		{
			name: "strapi::cors",
			config: {
				/**
				 |
				 | Replaces the stock `origin: "*"`, under which any page on
				 | the Internet could read this content API from a visitor's
				 | browser. An unlisted origin now gets no
				 | `Access-Control-Allow-Origin` header at all, which is how
				 | a browser is told no.
				 |
				 | Neither listed origin is load-bearing today — the website
				 | fetches server-side, and the admin panel is same-origin,
				 | which CORS does not police. That is the point: nothing
				 | legitimate needs cross-origin access to this CMS, so the
				 | list is short by design. Naming both anyway is what keeps
				 | it correct if either surface ever moves to a host of its
				 | own.
				 |
				 */
				origin: allowed_origins( env ),
			},
		},
		/**
		 |
		 | `strapi::poweredBy` used to sit here, announcing
		 | `X-Powered-By: Strapi <strapi.io>` on every response. The VAPT
		 | report found the framework disclosed "in multiple places"; this
		 | was one of them. Koa sets no such header of its own, so removing
		 | the middleware is the whole fix here. The other two places are
		 | not this file's to close: Express's `X-Powered-By`, handled in
		 | the website's own server, and nginx's `Server` banner, which
		 | ticket 03 suppresses at the proxy.
		 |
		 */
		"strapi::query",
		{
			name: "strapi::body",
			config: {
				formLimit: "20mb",
				jsonLimit: "20mb",
				textLimit: "20mb",
				formidable: {
					maxFileSize: 20 * 1024 * 1024, // 20MB in bytes
				},
			},
		},
		"strapi::session",
		"strapi::favicon",
		"strapi::public",
	]
}

/**
 |
 | helmet's configuration, which is where the header set lives.
 |
 | Only the content security policy varies by environment. The rest holds
 | everywhere, including on a developer's machine, so that what a scanner
 | sees in production is what we have been looking at all along.
 |
 */
function security_configuration ( env: Env ) {
	const base = {
		/**
		 |
		 | A year, on this hostname only.
		 |
		 | `includeSubDomains` and `preload` are both refused, and the
		 | refusal is the point: this CMS lives under a domain whose other
		 | subdomains we neither run nor can enumerate, and
		 | `includeSubDomains` would commit every one of them to HTTPS for a
		 | year on our say-so. `preload` is worse — it is close to
		 | irreversible and is baked into browsers. That call belongs to
		 | Godrej's IT team, who have the domain inventory to make it
		 | safely; it is handed to them in the response document rather than
		 | made for them here.
		 |
		 | Stock Strapi sends `includeSubDomains`. Setting it `false` rather
		 | than omitting it is what keeps that default from filling the gap
		 | back in.
		 |
		 */
		hsts: {
			maxAge: ONE_YEAR_IN_SECONDS,
			includeSubDomains: false,
			preload: false,
		},
		/**
		 |
		 | `X-Content-Type-Options: nosniff`.
		 |
		 | helmet's default, stated anyway: a control the report asked for
		 | should be visible in the configuration, not inferable from a
		 | dependency's defaults.
		 |
		 */
		noSniff: true,
		/**
		 |
		 | An admin URL names the document being edited. `same-origin` keeps
		 | the referrer inside the admin panel, where it is useful, and
		 | sends nothing at all anywhere else — including to the website
		 | when an editor follows a preview link out.
		 |
		 */
		referrerPolicy: { policy: "same-origin" },
	}

	if ( env( "IS_ON_AWS" ) !== "true" ) {
		return base
		// ↑ Strapi's default content security policy applies. It is right
		// 	for a local checkout, where media is served by this same
		// 	process.
	}

	/**
	 |
	 | In production, media is not ours to serve: it sits in S3 behind
	 | CloudFront, which is a different origin, so the admin panel's
	 | thumbnails and video previews need it named here or the browser
	 | refuses to render them.
	 |
	 | `frame-src` is not the whole story — Strapi's preview service appends
	 | `admin.preview.config.allowedOrigins` to this directive at boot,
	 | which is what lets the admin frame the website for Entry Preview. See
	 | `config/admin.ts`.
	 |
	 */
	const media_origins = [
		"'self'",
		"data:",
		"blob:",
		`${ env( "AWS_BUCKET_NAME" ) }.s3.${ env( "AWS_REGION" ) }.amazonaws.com`,
		env( "CLOUDFRONT_URL" ),
	]

	return {
		...base,
		contentSecurityPolicy: {
			useDefaults: true,
			directives: {
				"connect-src": [ "'self'", "https:", "http:" ],
				"img-src": media_origins,
				"media-src": media_origins,
				"frame-src": [ "'self'" ],
			},
		},
	}
}

/**
 |
 | The origins a browser may read this CMS from: the CMS's own, and the
 | website's.
 |
 | Both come from the environment as comma-separated lists, because the
 | website is more than one host and the CMS could become more than one
 | name.
 |
 */
function allowed_origins ( env: Env ) {
	return [
		...read_origins( env, "CMS_URLS" ),
		...read_origins( env, "CLIENT_URLS" ),
	]
}

function read_origins ( env: Env, key: string ): string[] {
	return String( env( key, "" ) )
		.split( "," )
		.map( entry => entry.trim() )
		.filter( entry => entry !== "" )
		.map( as_origin )
}

/**
 |
 | An `Origin` header is a scheme and a host, and these variables are
 | written both ways on the hosts we have: a full URL in a local checkout, a
 | bare hostname on the deployed ones — which is the form `config/admin.ts`
 | already expects. A bare hostname is therefore completed to `https://`,
 | rather than asking every host's environment file to be re-edited for this
 | ticket.
 |
 */
function as_origin ( entry: string ): string {
	return entry.includes( "://" )
		? entry
		: `https://${ entry }`
}
