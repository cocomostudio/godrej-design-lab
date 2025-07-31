
/**
 |
 | Main region
 |
 |
 */

import { Level } from "react-accessible-headings"

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
		return <Level>
			<div className="main-region empty:hidden mt-6 md:mt-8 lg:mt-10 md:ml-1c-1g lg:ml-2c-2g [&>:first-child]:mt-0 lg:w-9c-8g | [&>section:last-child_hr]:hidden">
				{ children }
			</div>
		</Level>
	}
}
