
/**
 |
 | Horizontal Rule
 |
 |
 */

import { shallow_clone_props } from "../utilities/shallow-clone-props"

export class HorizontalRule {
	static id = "v1.horizontal-rule"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ shade }) {
		return <hr className={ `mt-6 md:mt-8 lg:mt-10 ${ shade === "light" ? "border-black/30" : "border-black" }` } />
	}
}
