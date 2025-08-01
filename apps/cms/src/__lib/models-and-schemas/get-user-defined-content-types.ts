
import type { Core } from "@strapi/strapi"

export function get_user_defined_content_types ( strapi: Core.Strapi ) {
	const all_content_types = strapi.contentTypes
	return Object.keys( all_content_types )
		.filter( uid => uid.startsWith( "api::" ) )
			// ^ filter for user-defined (API) content types only
		.reduce( ( acc, uid ) => {
			acc[ uid ] = all_content_types[ uid ]
			return acc
		}, { } )
}
