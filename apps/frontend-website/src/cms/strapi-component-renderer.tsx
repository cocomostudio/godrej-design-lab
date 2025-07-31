
import {
	Fragment,
} from "react"

import { component_map } from "./component-map"

export function render_strapi_component ( component ) {
	if ( component === null || component === void 0 ) {
		return null
	}

	if ( ! component_map[ component.__component ] ) {
		console.log( "Component doesn't exist: ", component )
		return null
	}
	const node_processor = component_map[ component.__component ].process_node
	if ( typeof node_processor !== "function" ) {
		console.error( `Cannot find node processor for ${ component.__component }`, component )
		return null
	}
	const { __component, __content, ...props } = node_processor( component )
	const Component = component_map[ __component ].Renderer

	if ( ! Component ) {
		console.warn( `Unknown component type: ${ __component }`, __content, props );
		return null
	}

	const childElements = Array.isArray( __content )
		? __content.map( ( child, index ) => <Fragment key={ index }>
			{ render_strapi_component( child ) }
		</Fragment> )
		: render_strapi_component( __content )

	return <Component { ...props }>
		{ childElements }
	</Component>
}
