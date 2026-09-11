
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
	CMS_ADMIN_URLS: string[]
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
	 | The CMS's origins **as a browser sees them** — a third answer again,
	 | distinct from both of the above: `CMS_URL` is a private address only
	 | this process can resolve, and `CMS_PUBLIC_URL` is the CDN in front of
	 | the media. This one is where the admin panel is served from, and it
	 | exists for exactly one reason: the admin frames this website for Entry
	 | Preview, so the content security policy has to name it as a permitted
	 | frame ancestor.
	 |
	 | The same value is `CMS_URLS` in the CMS's own environment file. It is
	 | not called that here because `CMS_URL` next door already means something
	 | else entirely, and two keys one letter apart with unrelated meanings is
	 | a trap rather than a symmetry.
	 |
	 | Comma-separated, because the CMS could answer to more than one name, and
	 | scheme-completed to `https://` — the deployed hosts write these as bare
	 | hostnames, which is the form the CMS's own origin lists already take.
	 |
	 | Empty is allowed: the policy ships report-only, so an unset value costs
	 | a console report during Entry Preview and nothing else.
	 |
	 */
	CMS_ADMIN_URLS: read_origins( process.env.CMS_ADMIN_URLS ),
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
 | A comma-separated list of origins, as the CMS's `CMS_URLS` and `CLIENT_URLS`
 | are written on every host we have.
 |
 | An entry without a scheme is completed to `https://`, matching how
 | `apps/cms/config/middlewares.ts` reads the same shape of value: the deployed
 | hosts write bare hostnames, a local checkout writes full URLs, and both are
 | meant to work without re-editing an environment file per ticket. A bare
 | hostname reached over cleartext is therefore a hostname this never matches,
 | which is the right way round.
 |
 */
function read_origins ( raw: string | undefined ): string[] {
	return ( raw ?? "" )
		.split( "," )
		.map( entry => entry.trim() )
		.filter( entry => entry !== "" )
		.map( entry => entry.includes( "://" ) ? entry : `https://${ entry }` )
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
