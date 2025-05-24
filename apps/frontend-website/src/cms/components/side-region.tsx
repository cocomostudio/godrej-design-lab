
/**
 |
 | Side region
 |
 |
 */

import { shallow_clone_props } from "../utilities/shallow-clone-props"

export class SideRegion {
	static id = "container.side-region-v1"

	constructor ( child_nodes ) {
		return {
			__component: SideRegion.id,
			__content: [ ...child_nodes ]
		}
	}

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ children }) {
		return <aside className="side-content-area max-md:mt-6 md:absolute md:top-50 md:left-0 md:w-1c lg:w-2c">{ children }</aside>
	}
}
