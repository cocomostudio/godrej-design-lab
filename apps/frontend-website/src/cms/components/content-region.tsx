
/**
 |
 | Content region
 |
 |
 */

import { shallow_clone_props } from "../utilities/shallow-clone-props"

export class ContentRegion {
	static id = "container.content-region-v1"

	constructor ( child_nodes ) {
		return {
			__component: ContentRegion.id,
			__content: [ ...child_nodes ]
		}
	}

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ children }) {
		return <main className="mt-8">{ children }</main>
	}
}
