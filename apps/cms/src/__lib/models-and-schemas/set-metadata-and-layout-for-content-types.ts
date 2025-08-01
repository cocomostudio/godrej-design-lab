
import deepmerge from "@fastify/deepmerge"

import type { Core } from "@strapi/strapi"

import { replace_by_cloned_source } from "../@fastify/deepmerge/replace-by-clone-source"

const deep_merge = deepmerge( {
	all: true,
	mergeArray: replace_by_cloned_source
} )

export async function set_metadata_and_layout_for_content_types ( uid: string, data: any = { }, store: ReturnType<Core.Strapi[ "store" ]> ) {
	const { metadatas, layouts } = data
	if ( ! metadatas && ! layouts ) {
		return
	}

	let value: any = { }
	if ( metadatas ) {
		value.metadatas = metadatas
	}
	if ( layouts ) {
		value.layouts = layouts
	}

	// First, procure the existing value from the store
	const existingValue = await store.get( {
		key: `configuration_content_types::${ uid }`,
	} ) || { }

	// Set the new value by merging it onto the existing value
	await store.set( {
		key: `configuration_content_types::${ uid }`,
		value: deep_merge( existingValue, value ),
	} )
}
