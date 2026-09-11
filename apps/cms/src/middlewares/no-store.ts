
import type { Core } from "@strapi/strapi"

/**
 |
 | Nothing the CMS returns may be stored.
 |
 | This is an authenticated administration surface, and a content API
 | behind it. Every response is either somebody's session-scoped view of
 | the data or the data itself, and neither belongs in a shared cache, a
 | browser's disk cache, or a proxy in between. The VAPT report asked for
 | it; here it is the right answer.
 |
 | **It is deliberately not applied to the public website.** There the same
 | directive would disable caching on a content site for no security
 | benefit. See the ticket: `02-cms-response-hardening` under
 | `__this-project/build-plans/2026-09-11__vapt-remediation/tickets/`.
 |
 | The three directives say the same thing to three generations of cache.
 | `no-store` is the modern one and the only one a current browser needs;
 | `no-cache` and `must-revalidate` are what an older intermediary
 | understands, and what the report's checklist looks for.
 |
 */
const CACHE_CONTROL = "no-store, no-cache, must-revalidate"

/**
 |
 | Set **after** `next()`, so that it is the last word.
 |
 | Several things downstream have opinions about caching — `koa-static`,
 | serving the admin build under `strapi::public`, stamps its own
 | `Cache-Control` on every asset — and a header set on the way in would
 | simply be overwritten on the way out.
 |
 | Which is also why this middleware sits first in the chain rather than
 | where `strapi::poweredBy` used to. Everything that could overwrite the
 | header has to be downstream of it, and that includes `strapi::errors`:
 | placed below that, the line would be skipped whenever a handler threw,
 | and every converted 4xx and 5xx would go out without the directive.
 |
 */
const no_store: Core.MiddlewareFactory = () => {
	return async function no_store_middleware ( ctx, next ) {
		await next()
		ctx.set( "Cache-Control", CACHE_CONTROL )
	}
}

export default no_store
