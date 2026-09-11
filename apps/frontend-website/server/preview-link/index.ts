/**
 |
 | Whether this request is allowed to see unpublished content.
 |
 | It used to be allowed to ask for it simply by saying so. The CMS route
 | handler read `?status=` off the visitor's URL and forwarded it to the CMS
 | unexamined, so every draft, every unapproved photograph and every entry
 | somebody was still arguing about was readable by anyone who appended
 | `?status=draft` to a page address. Ticket:
 | `07-unpublished-content-is-not-one-parameter-away` under
 | `__this-project/build-plans/2026-09-11__vapt-remediation/tickets/`.
 |
 | The difficulty is that Entry Preview is a real feature and has to keep
 | working. An editor opens a preview inside the CMS admin; the admin frames
 | *this* website; this server then fetches the page from the CMS over its own
 | connection, carrying none of the editor's credentials. There is no session
 | to check at the moment it matters. So the CMS signs the preview URL it
 | generates, and this file is the only thing in the website that can turn
 | that signature into permission.
 |
 | **The signing half is a deliberate duplicate**, in
 | `apps/cms/src/__lib/this/preview-link.ts`, which carries the reasoning for
 | the duplication. If the message signed there changes, the message verified
 | here changes with it or Entry Preview stops showing drafts.
 |
 | This module is under `server/` and reachable only from `.server.ts`
 | modules. The secret must never be in a browser bundle, and a verification
 | that ran in a browser would not be a verification.
 |
 */

import crypto from "node:crypto"

import { Environment } from "../environment/index.ts"

const SIGNATURE_PARAMETER = "preview_signature"

const STATUS_PARAMETER = "status"

/**
 |
 | The two statuses the CMS understands. `published` is also what this module
 | falls back to, which is the reason it is named rather than inlined.
 |
 */
const STATUSES = {
	DRAFT: "draft",
	PUBLISHED: "published",
} as const

type ContentStatus = typeof STATUSES[ keyof typeof STATUSES ]

/**
 |
 | The status the CMS will actually be asked for.
 |
 | **Read the visitor's `status` parameter through this function and nowhere
 | else.** That is the whole design: there is no separate "verify" call a
 | future caller could forget to make, because the only way to learn what
 | status was requested is to be told what status is permitted.
 |
 | Anything that is not a signed request for a draft resolves to `published`,
 | including a request for a status that does not exist. Falling back rather
 | than refusing keeps a visitor who arrives with a stale or copied preview
 | link on a working page, and keeps a crawler that invents a query parameter
 | out of the error log — and the fallback is the safe direction, which is
 | what makes it available at all.
 |
 | `path` is the page being asked for, and it is part of what was signed:
 | a signature minted for one page proves nothing about another. It arrives
 | straight off React Router's splat parameter, **which is `undefined` on the
 | index route** — the site's own front page — rather than the empty string
 | anybody would predict. `canonical_path` absorbs that.
 |
 */
export function resolve_content_status (
	path: string | undefined,
	search_params: URLSearchParams,
): ContentStatus {
	if ( search_params.get( STATUS_PARAMETER ) !== STATUSES.DRAFT ) {
		return STATUSES.PUBLISHED
	}

	return is_signature_valid(
		path,
		STATUSES.DRAFT,
		search_params.get( SIGNATURE_PARAMETER ),
	)
		? STATUSES.DRAFT
		: STATUSES.PUBLISHED
}

/**
 |
 | **An unset secret denies, it does not permit.**
 |
 | `PREVIEW_LINK_SECRET` has no default — see its comment in
 | `server/environment/index.ts` — and the empty string it becomes when a host
 | forgets it is a perfectly usable HMAC key. Without this line a deployment
 | that never configured the secret would sign and verify with a key the
 | entire Internet can guess, and would look, from the outside and from Entry
 | Preview, exactly like one that had configured it correctly. That is the
 | worst failure this file could have, so it is the first one it checks for.
 |
 */
function is_signature_valid (
	path: string | undefined,
	status: string,
	presented: string | null,
): boolean {
	const secret = Environment.get( "PREVIEW_LINK_SECRET" )
	if ( ! secret || ! presented ) return false

	const expected = sign( path, status, secret )

	/**
	 |
	 | Compared in constant time, and length-checked first because
	 | `timingSafeEqual` throws on a length mismatch rather than returning
	 | false. The lengths are public — every valid signature is the same
	 | 64 characters — so leaking that much is leaking nothing.
	 |
	 */
	const presented_bytes = Buffer.from( presented, "utf8" )
	const expected_bytes = Buffer.from( expected, "utf8" )
	if ( presented_bytes.length !== expected_bytes.length ) return false

	return crypto.timingSafeEqual( presented_bytes, expected_bytes )
}

/**
 |
 | HMAC-SHA256 over the path and the status, newline-separated. The signing
 | side carries the full reasoning; the short version is that the path is in
 | the message so that a signature cannot be replayed against a different
 | page, and the separator is a newline because neither field can contain one.
 |
 */
function sign ( path: string | undefined, status: string, secret: string ): string {
	return crypto
		.createHmac( "sha256", secret )
		.update( canonical_message( path, status ) )
		.digest( "hex" )
}

function canonical_message ( path: string | undefined, status: string ): string {
	return `${ canonical_path( path ) }\n${ status }`
}

/**
 |
 | The one spelling of a path that both sides agree on.
 |
 | The CMS reads a `url_path` off a `url_alias` entry; this server
 | reconstructs it from a React Router splat parameter, which arrives without
 | a leading slash, with whatever trailing slash the visitor typed, and as
 | `undefined` rather than `""` on the index route. A leading slash and no
 | trailing one is the form both can reach, and the root is the single slash
 | rather than the empty string.
 |
 | **Neither side normalises percent-encoding, and that is a bounded
 | omission rather than an oversight.** This side is handed React Router's
 | already-decoded splat; the other reads a `url_path` straight out of the
 | database. They would disagree on any path carrying an escape or a
 | non-ASCII character — silently, showing the published page. Every
 | `url_path` in the database today is a plain ASCII slug, because webtools
 | generates them by slugifying, and a normalisation step that no content can
 | exercise is a security control nobody can test. Revisit it the day a slug
 | stops being `[a-z0-9/-]`.
 |
 | **Duplicated from `apps/cms/src/__lib/this/preview-link.ts`**, which has
 | no `undefined` to absorb because a `url_path` it cannot read is a preview
 | link it does not generate. A drift between the two does not fail loudly —
 | it silently shows an editor the published page where they expected their
 | draft.
 |
 */
function canonical_path ( raw: string | undefined ): string {
	const path = raw ?? ""
	const with_leading_slash = path.startsWith( "/" ) ? path : `/${ path }`
	const without_trailing_slash = with_leading_slash.replace( /\/+$/, "" )
	return without_trailing_slash || "/"
}
