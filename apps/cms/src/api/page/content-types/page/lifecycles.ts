
export default {
	async beforeCreate ( event ) {
		const { data } = event.params

		const page_context = await set_default_page_context( data )
		if ( page_context ) {
			data.page_context = page_context
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

