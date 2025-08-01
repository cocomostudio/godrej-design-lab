
import type { Core } from "@strapi/strapi"

import { get_user_defined_content_types } from "../models-and-schemas/get-user-defined-content-types"
import { set_metadata_and_layout_for_content_types } from "../models-and-schemas/set-metadata-and-layout-for-content-types"

export async function configure_metadata_and_layout_for_content_types ( strapi: Core.Strapi ) {
	const content_types = get_user_defined_content_types( strapi )

	const store = strapi.store( { type: "plugin", name: "content_manager" } )

	for ( const key in content_types ) {
		const content_type = content_types[ key ]
		await set_metadata_and_layout_for_content_types( content_type.uid, content_type.__, store )
	}
}
