
import type { Core } from "@strapi/strapi"

export function get_user_defined_components ( strapi: Core.Strapi ) {
	const all_components = strapi.components
	return Object.keys( all_components )
		.filter( uid => !uid.startsWith( "plugin::" ) )
			// ^ filter for user-defined (API) content types only
		.reduce( ( acc, uid ) => {
			acc[ uid ] = all_components[ uid ]
			return acc
		}, { } )
}
