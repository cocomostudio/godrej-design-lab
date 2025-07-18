
/**
 |
 | Heading region
 |
 |
 */

import { shallow_clone_props } from "../utilities/shallow-clone-props"

export class HeaderRegion {
	static id = "container.header-region-v1"

	constructor ( child_nodes ) {
		return {
			__component: HeaderRegion.id,
			__content: Array.isArray( child_nodes?.content ) ? [ ...child_nodes.content ] : [ ]
		}
	}

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ children }) {
		return <div className="header-region empty:hidden max-md:order-first mt-8 md:ml-1c-1g lg:ml-2c-2g lg:w-9c-8g">{ children }</div>
	}
}
