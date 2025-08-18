
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
				allowedOrigins: env( "CLIENT_URL" ),
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

					const url_base = env( "IS_ON_AWS" ) === "true" ? `https://${ env( "CLIENT_URL" ) }` : env( "CLIENT_URL" );
					const status_query_param_string = `?status=${ status }`

					return url_base + url_path + status_query_param_string
				}
			}
		},
	}
}
