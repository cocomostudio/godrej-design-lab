
export default {
	async beforeCreate ( event ) {
		const { data } = event.params

		const page_context = await set_default_page_context( data )
		if ( page_context ) {
			data.page_context = page_context
		}
		const color_scheme = await set_default_color_scheme( data )
		if ( color_scheme ) {
			data.color_scheme = color_scheme
		}
	}
}





async function set_default_page_context ( data ) {
	// If it is already set
	if ( data.page_context ) {
		return data.page_context
	}

	try {
		const first_page_context = await strapi.entityService.findMany( "api::page-context.page-context", {
			limit: 1,
			sort: { createdAt: "asc" }
		} )

		if ( first_page_context && first_page_context.length > 0 ) {
			data.page_context = first_page_context[ 0 ].id
		}
	}
	catch ( error ) {
		strapi.log.error( "Failed to set default page context:", error )
	}
}

async function set_default_color_scheme ( data ) {
	// If it is already set
	if ( data.color_scheme ) {
		return data.color_scheme
	}

	try {
		const firstColorScheme = await strapi.entityService.findMany( "api::color-scheme.color-scheme", {
			limit: 1,
			sort: { createdAt: "asc" }
		} )

		if ( firstColorScheme && firstColorScheme.length > 0 ) {
			data.color_scheme = firstColorScheme[ 0 ].id
		}
	}
	catch ( error ) {
		strapi.log.error( "Failed to set default color scheme:", error )
	}
}
