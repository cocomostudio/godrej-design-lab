
/**
 |
 | Where a picture the CMS stores is actually served from.
 |
 | Strapi's own upload provider writes a relative path — `/uploads/…` — and the
 | website is a different origin, so something has to put the CMS's back in
 | front of it. Its S3 provider writes an absolute CDN URL instead, which
 | already answers the question and must be left alone.
 |
 */

export function media_url ( url: string, origin: string ): string {
	if ( ! url ) {
		return url
	}

	if ( /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test( url ) ) {
		return url
	}
		// ↑ Absolute, or protocol-relative. Either way it names its own origin.

	return origin + url
}
