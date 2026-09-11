/**
 |
 | The signing half of the preview link.
 |
 | Entry Preview works by handing an editor's browser a URL on the *website*
 | and framing it. The website then fetches that page from this CMS
 | server-side, without the editor's session — so by the time the request that
 | matters is made, nothing is left of the fact that an authenticated
 | administrator asked for it. Until this ticket the website simply forwarded
 | whatever `?status=` it was given, which made every unpublished entry
 | readable by anyone who appended `?status=draft` to a page URL.
 |
 | What crosses that gap instead is a signature. This file mints it; the
 | website verifies it before it will ask for anything but published content.
 | Ticket: `07-unpublished-content-is-not-one-parameter-away` under
 | `__this-project/build-plans/2026-09-11__vapt-remediation/tickets/`.
 |
 | **The verifying half is a deliberate duplicate**, in
 | `apps/frontend-website/server/preview-link/index.ts`. The two applications
 | are separately built and separately deployed — this one compiles through
 | Strapi's own `tsc` run, which has no workspace dependency on the shared
 | package the website uses — so a shared module would have to be published
 | and versioned to be shared at all. Twenty lines of HMAC on each side is the
 | cheaper honesty. **If the message this file signs changes, the other file
 | changes with it or Entry Preview stops showing drafts.**
 |
 */

import crypto from "node:crypto"

/**
 |
 | The parameter the signature travels in.
 |
 | Spelled identically on the verifying side. It sits alongside `status`
 | rather than replacing it, so a published preview link — which needs no
 | signature, because published content is public — stays exactly the URL a
 | visitor would use.
 |
 */
const SIGNATURE_PARAMETER = "preview_signature"

const STATUS_PARAMETER = "status"

const DRAFT_STATUS = "draft"

/**
 |
 | The query string an Entry Preview URL carries.
 |
 | Only a draft is signed. A request for published content is the ordinary
 | public request, and attaching a signature to it would suggest the
 | signature is what authorises the read rather than what authorises reading
 | *unpublished* content.
 |
 | With no secret configured this returns the status alone, and the website
 | serves published content in the preview frame. That is the visible
 | failure, and it is preferred to the alternatives: signing with an empty
 | secret would produce a signature anyone could compute, and throwing would
 | take out the preview button for a configuration fault the editor cannot
 | fix. The log line below is the part an operator can act on.
 |
 */
export function preview_link_query_string ( url_path: string, status: string, secret: string ): string {
	const parameters = new URLSearchParams( { [ STATUS_PARAMETER ]: status } )

	if ( status === DRAFT_STATUS ) {
		if ( secret ) {
			parameters.set( SIGNATURE_PARAMETER, sign( url_path, status, secret ) )
		}
		else {
			/**
			 |
			 | `strapi.log`, not `console` — it is the logger everything else
			 | in `src/` writes to, and on the deployed host it is what the
			 | process manager collects. Reachable because the only caller is
			 | the preview handler in `config/admin.ts`, which runs at request
			 | time against a booted Strapi, not at configuration-load time.
			 |
			 */
			strapi.log.error(
				"[preview-link] PREVIEW_SECRET is not set, so this preview link "
				+ "cannot be signed and the website will serve published content "
				+ "in the preview frame. Set it in apps/cms/.env, to the same "
				+ "value as PREVIEW_LINK_SECRET in the website's environment.",
			)
		}
	}

	return "?" + parameters.toString()
}

/**
 |
 | HMAC-SHA256 over the path and the status, in that order, separated by a
 | newline.
 |
 | **The path is in the message, which is what stops a signature being
 | replayed against a different page.** One leaked preview link is a
 | capability to read one unpublished entry, not a key to the whole
 | unpublished site.
 |
 | The status is in it too. It costs nothing, and it means a signature can
 | never be repurposed if a third status is ever added.
 |
 | A newline is the separator because it cannot appear in either field — a
 | URL path carrying a raw newline is not a URL — so no pair of inputs can
 | produce the same message as a different pair.
 |
 */
function sign ( url_path: string, status: string, secret: string ): string {
	return crypto
		.createHmac( "sha256", secret )
		.update( canonical_message( url_path, status ) )
		.digest( "hex" )
}

function canonical_message ( url_path: string, status: string ): string {
	return `${ canonical_path( url_path ) }\n${ status }`
}

/**
 |
 | The one spelling of a path that both sides agree on.
 |
 | They arrive at it from different directions and would otherwise disagree:
 | this side reads a `url_path` off a `url_alias` entry, the other
 | reconstructs it from a React Router splat parameter. A leading slash and
 | no trailing one is the form both can reach, and the root is the single
 | slash rather than the empty string.
 |
 | **Neither side normalises percent-encoding, and that is a bounded
 | omission rather than an oversight.** That side is handed React Router's
 | already-decoded splat; this one reads a `url_path` straight out of the
 | database. They would disagree on any path carrying an escape or a
 | non-ASCII character — silently, showing the published page. Every
 | `url_path` in the database today is a plain ASCII slug, because webtools
 | generates them by slugifying, and a normalisation step that no content can
 | exercise is a security control nobody can test. Revisit it the day a slug
 | stops being `[a-z0-9/-]`.
 |
 | **This function is duplicated verbatim on the verifying side. It is the
 | part most likely to drift and the part whose drift is hardest to see** —
 | a mismatch here does not fail loudly, it silently shows an editor the
 | published page.
 |
 */
function canonical_path ( raw: string ): string {
	const with_leading_slash = raw.startsWith( "/" ) ? raw : `/${ raw }`
	const without_trailing_slash = with_leading_slash.replace( /\/+$/, "" )
	return without_trailing_slash || "/"
}
