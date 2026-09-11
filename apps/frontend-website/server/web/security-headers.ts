/**
 |
 | The website's security headers.
 |
 | One middleware, registered above everything that can answer a request —
 | above the static mounts in particular. That position is the whole reason
 | ticket 01 took the HTTP server off `react-router-serve`: headers set at the
 | document-rendering layer reach rendered pages and miss every `.js`, `.css`
 | and `.svg` underneath them, which is precisely where a MIME-sniffing
 | directive earns its keep, and precisely the gap a retest finds.
 |
 | Hand-rolled rather than helmet. The set is four headers, three of them
 | constant; a dependency would add its own defaults underneath, after which
 | knowing what is actually sent means reading this file against that library's
 | version-specific defaults. The CMS uses helmet only because Strapi already
 | ships it. Ticket: `06-website-security-headers`.
 |
 | Cache-Control is deliberately absent. The report recommends `no-store`
 | everywhere; that is applied on the CMS, where it belongs, and declined here,
 | where it would disable caching on a public content site for no security
 | benefit. Every mount below keeps the lifetimes `react-router-serve` used.
 |
 */

import type Express from "express"

import { Environment } from "../environment/index.ts"

const ONE_YEAR_IN_SECONDS = 31536000

/**
 |
 | Settled at module evaluation rather than per request: nothing in it varies
 | by request, and a header set that can differ between two responses is a
 | header set nobody can reason about.
 |
 */
const HEADERS: Record<string, string> = {
	/**
	 |
	 | A year, on this hostname only.
	 |
	 | `includeSubDomains` and `preload` are both absent, and the absence is the
	 | point: this site lives under a domain whose other subdomains we neither
	 | run nor can enumerate, and `includeSubDomains` would commit every one of
	 | them to HTTPS for a year on our say-so. `preload` is worse — close to
	 | irreversible, and baked into browser binaries. That call belongs to
	 | Godrej's IT team, who have the domain inventory to make it safely; the
	 | response document hands it to them rather than making it for them.
	 |
	 | Sent on every response, including the cleartext ones a developer sees. A
	 | browser ignores HSTS that arrives over anything but HTTPS — that is the
	 | mechanism's own rule, not a gap here — so an unconditional header is both
	 | the simplest thing that is correct and the one that guarantees what a
	 | scanner sees in production is what we have been looking at all along.
	 |
	 */
	"Strict-Transport-Security": `max-age=${ ONE_YEAR_IN_SECONDS }`,
	/**
	 |
	 | Stops a browser from second-guessing a `Content-Type` — the reason this
	 | middleware sits above the static mounts rather than beside the renderer.
	 |
	 */
	"X-Content-Type-Options": "nosniff",
	/**
	 |
	 | Not the CMS's `same-origin`, and the difference is deliberate.
	 |
	 | A path on this site can carry a signed preview parameter, so a full URL
	 | must never leave the origin — which this policy guarantees: it sends the
	 | bare origin cross-origin, never the path or the query, and sends nothing
	 | at all when the destination is a downgrade to HTTP.
	 |
	 | It stops short of `same-origin` because the CMS renders
	 | operator-authored third-party embeds into these pages by design, and an
	 | embed whose provider checks a referrer allow-list needs an origin to
	 | check. Withholding it would break that silently, months later, for a gain
	 | of nothing — the origin is already public.
	 |
	 */
	"Referrer-Policy": "strict-origin-when-cross-origin",
	/**
	 |
	 | Report-only, deliberately and for now. A policy is promoted to enforcing
	 | against observed reports, not against a guess made before anything has
	 | been observed — and the thing most likely to be surprised by it, Entry
	 | Preview, is a feature nobody exercises daily. Violations land in the
	 | browser console; there is no reporting endpoint, and standing one up is
	 | not this ticket.
	 |
	 */
	"Content-Security-Policy-Report-Only": content_security_policy(),
}

export function register_security_headers_middleware (
	express_app: Express.Application,
) {
	express_app.use( ( _request, response, next ) => {
		for ( const [ name, value ] of Object.entries( HEADERS ) ) {
			response.setHeader( name, value )
		}
		next()
	} )
}

/**
 |
 | **There is no `script-src` here, and that is the considered position rather
 | than an omission.**
 |
 | The CMS ships a script component: an editor pastes inline code or a
 | third-party `src` into an entry and it is rendered into the page. That is a
 | designed-in injection point, controlled by admin authentication rather than
 | by this header. Any `script-src` permissive enough to keep the feature
 | working — `'unsafe-inline'`, plus a wildcard for whatever host an editor
 | names next — constrains nothing whatsoever, while telling every future
 | reader of these headers that scripts on this site are constrained. A policy
 | that claims a control it does not have is worse than one that stays quiet,
 | because the next auditor stops looking.
 |
 | **There is no `default-src` either, for the same reason and not by
 | oversight.** `default-src` is the fallback for `script-src`, so adding one
 | would re-assert the claim this directive list exists to avoid.
 |
 | What is left is only what this application can actually keep.
 |
 */
function content_security_policy (): string {
	return [
		/**
		 |
		 | Our own origin, and the CMS's — `CMS_ADMIN_URLS`, which is the
		 | admin panel's origin as a browser reaches it. See the key's own
		 | comment in `server/environment/index.ts` for why that is a third
		 | answer distinct from `CMS_URL` and `CMS_PUBLIC_URL`.
		 |
		 | The conventional `'self'` alone would be wrong here: the CMS frames
		 | this website inside the admin panel for Entry Preview, so `'self'`
		 | would break an editor's ability to see a draft before publishing
		 | it — a feature, not an attack. Naming the CMS origin explicitly is
		 | what keeps clickjacking protection and Entry Preview in the same
		 | policy. Unset, this degrades to `'self'`, which costs a console
		 | report during Entry Preview while the policy is report-only and
		 | costs Entry Preview itself once it is enforcing.
		 |
		 | Deliberately not paired with `X-Frame-Options`: that header cannot
		 | express two origins, so it could only be set to a value that breaks
		 | Entry Preview or to one (`ALLOW-FROM`) that no current browser
		 | honours.
		 |
		 */
		`frame-ancestors ${
			[ "'self'", ...Environment.get( "CMS_ADMIN_URLS" ) ].join( " " )
		}`,
		/**
		 |
		 | No `<object>`, `<embed>` or `<applet>`. Nothing on this site uses
		 | them, and a plugin document is a script execution context that
		 | nothing above would police.
		 |
		 */
		"object-src 'none'",
		/**
		 |
		 | An injected `<base href>` silently re-points every relative URL on
		 | the page — including the ones this policy does not cover.
		 |
		 */
		"base-uri 'self'",
		/**
		 |
		 | A form on this site posts to this site. Anything else is a form
		 | whose target was rewritten.
		 |
		 */
		"form-action 'self'",
	].join( "; " )
}
