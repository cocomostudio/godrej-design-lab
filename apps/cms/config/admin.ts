
import { preview_link_query_string } from "../src/__lib/this/preview-link"

export default function ( { env } ) {
	return {
		auth: {
			secret: env( "ADMIN_JWT_SECRET" ),
		},
		apiToken: {
			salt: env( "API_TOKEN_SALT" ),
		},
		transfer: {
			token: {
				salt: env( "TRANSFER_TOKEN_SALT" ),
			},
		},
		flags: {
			nps: env.bool( "FLAG_NPS", false ),
			promoteEE: env.bool( "FLAG_PROMOTE_EE", false ),
		},
		autoOpen: false,
		preview: {
			enabled: true,
			config: {
				allowedOrigins: env( "CLIENT_URLS" ).split( "," ),
				async handler ( uid, { documentId, locale, status } ) {
					if ( ! uid || ! status ) {
						return null
					}

					const document = await strapi.documents( uid ).findOne( {
						documentId,
						status,
						populate: [
							"url_alias"
						]
					} )

					const url_path = document?.url_alias?.[ 0 ]?.url_path
					if ( ! url_path ) {
						return null
					}

					const a_client_url = env( "CLIENT_URLS" ).split( "," )[ 0 ]
					const url_base = env( "IS_ON_AWS" ) === "true" ? `https://${ a_client_url }` : a_client_url;

					/**
					 |
					 | The status no longer travels on its own.
					 |
					 | The website fetches this page from the CMS server-side,
					 | without the editor's session, so a bare `?status=draft`
					 | is a request it cannot tell from a stranger's — which
					 | is how unpublished content came to be one query
					 | parameter away from anybody. A signature over this
					 | path and this status is what survives the gap. See
					 | `src/__lib/this/preview-link.ts`.
					 |
					 */
					const query_string = preview_link_query_string(
						url_path,
						status,
						env( "PREVIEW_SECRET", "" ),
					)

					return url_base + url_path + query_string
				}
			}
		},
	}
}
