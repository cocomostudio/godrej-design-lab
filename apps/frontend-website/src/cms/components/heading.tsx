
/**
 |
 | Heading
 |
 |
 */

import { shallow_clone_props } from "../utilities/shallow-clone-props"

export class Heading {
	static id = "text.heading-v1"

	constructor ( props ) {
		return {
			__component: Heading.id,
			...props,
		}
	}

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ level, heading, pre_heading = "", font_family, className = null, children = null }) {
		const font_family_class = font_family === "monospace" ? "font-mono" : "font-sans"
		const Heading = heading_levels_to_elements[ level ]
		const classes = heading_levels_to_classes[ level ]

		if ( children ) {
			return <Heading className={ `h mt-6 md:mt-8 lg:mt-10 ${ classes } font-bold uppercase text-primary ${ className }` }>
				{ children }
			</Heading>
		}
		else if ( pre_heading ) {
			return <Heading className={ `h mt-6 md:mt-8 lg:mt-10 ${ classes } ${ font_family_class } font-bold uppercase ${ className }` }>
				<span className="text-primary">{ pre_heading }</span>
				<br />
				<span className="text-secondary">{ heading }</span>
			</Heading>
		}
		else {
			return <Heading className={ `h mt-6 md:mt-8 lg:mt-10 ${ classes } font-bold uppercase text-secondary ${ className }` }>
				{ heading }
			</Heading>
		}
	}
}

const heading_levels_to_elements = {
	h1: "h1",
	h2: "h2",
	h3: "h3",
	h4: "h4",
	h5: "h5",
	h6: "h6",
}
const heading_levels_to_classes = {
	h1: "text-h1 text-primary",
	h2: "text-h3 md:text-h2 lg:text-h3 text-primary",
	h3: "text-h4 md:text-h2 lg:text-h4 text-primary",
	h4: "text-h5 md:text-h3 lg:text-h5 text-secondary",
	h5: "text-p md:text-h4 lg:text-p text-secondary",
	h6: "text-p text-secondary",
}
