
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

					return env( "CLIENT_URL" ) + url_path
				}
			}
		},
	}
}
