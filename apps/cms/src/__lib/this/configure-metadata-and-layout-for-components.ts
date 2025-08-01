
import type { Core } from "@strapi/strapi"

import { get_user_defined_components } from "../models-and-schemas/get-user-defined-components"
import { set_metadata_and_layout_for_components } from "../models-and-schemas/set-metadata-and-layout-for-components"

export async function configure_metadata_and_layout_for_components ( strapi: Core.Strapi ) {
	const components = get_user_defined_components( strapi )

	const store = strapi.store( { type: "plugin", name: "content_manager" } )

	for ( const key in components ) {
		const component = components[ key ]
		await set_metadata_and_layout_for_components( component.uid, component.__, store )
	}
}
