
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
			__content: [ ...child_nodes ]
		}
	}

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ children }) {
		return <div className="header-region mt-8">{ children }</div>
	}
}
