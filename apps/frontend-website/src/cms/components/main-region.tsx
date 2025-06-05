
/**
 |
 | Main region
 |
 |
 */

import { shallow_clone_props } from "../utilities/shallow-clone-props"

export class MainRegion {
	static id = "container.main-region-v1"

	constructor ( child_nodes ) {
		return {
			__component: MainRegion.id,
			__content: Array.isArray( child_nodes?.content ) ? [ ...child_nodes.content ] : [ ]
		}
	}

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ children }) {
		return <div className="main-region empty:hidden mt-8 md:mt-9 lg:mt-10 md:ml-1c-1g lg:ml-2c-2g [&>:first-child]:mt-0">{ children }</div>
	}
}
