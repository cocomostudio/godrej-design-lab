
/**
 |
 | Heading region
 |
 |
 */

import { shallow_clone_props } from "../utilities/shallow-clone-props"

export class HeadingRegion {
	static id = "container.heading-region-v1"

	constructor ( child_nodes ) {
		return {
			__component: HeadingRegion.id,
			__content: [ ...child_nodes ]
		}
	}

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ children }) {
		return <div className="heading-region mt-8">{ children }</div>
	}
}
