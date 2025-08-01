
import type { Core } from "@strapi/strapi"

import { configure_metadata_and_layout_for_content_types } from "./__lib/this/configure-metadata-and-layout-for-content-types"
import { configure_metadata_and_layout_for_components } from "./__lib/this/configure-metadata-and-layout-for-components"

export default {
	/**
	 | An asynchronous register function that runs before
	 | your application is initialized.
	 |
	 | This gives you an opportunity to extend code.
	 */
	register( /* { strapi }: { strapi: Core.Strapi } */ ) {
	},

	/**
	 | An asynchronous bootstrap function that runs before
	 | your application gets started.
	 |
	 | This gives you an opportunity to set up your data model,
	 | run jobs, or perform some special logic.
	 */
	bootstrap( { strapi }: { strapi: Core.Strapi } ) {
		configure_metadata_and_layout_for_components( strapi )
		configure_metadata_and_layout_for_content_types( strapi )
	},
}
