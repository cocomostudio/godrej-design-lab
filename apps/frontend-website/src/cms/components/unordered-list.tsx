
/**
 |
 | Unordered List
 |
 |
 */

import { shallow_clone_props } from "../utilities/shallow-clone-props"

export class UnorderedList {
	static id = "text.unordered-list-v1"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ items, two_columns }) {
		const ul_classes = two_columns ? "columns-2 md:columns-2c-2g lg:columns-3c-1g" : ""
		return <ul className={ `mt-6 md:mt-8 first:mt-0 ${ ul_classes } text-p font-mono font-bold` }>
			{ items.map( ( item, i ) => <li key={ i } className={ `flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs` }>
				{ item.content }
			</li> ) }
		</ul>
	}
}
