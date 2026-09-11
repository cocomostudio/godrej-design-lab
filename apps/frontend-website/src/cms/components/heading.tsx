
/**
 |
 | Heading
 |
 |
 */

import { Link } from "react-router"
import { H } from "react-accessible-headings"

import { with_line_breaks } from "~/__lib/react/line-breaks"
import { Button } from "~/__lib/react/button"
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

	static Renderer ({ level, line_1 = "", line_2, font_family, link, className = null, children = null, style }) {
		const font_family_class = font_family === "monospace" ? "font-mono" : "font-sans"
		const common_classes = "full-width h mt-6 md:mt-8 lg:mt-10"
		let classes = heading_levels_to_classes[ level ]

		if ( className && className.includes( "normal-case" ) ) {

		}
		else {
			classes += " uppercase"
		}

		if ( children ) {
			return <HeadingContainer link={ link }>
				<H className={ `${ common_classes } ${ classes } text-primary ${ className }` } style={ style }>
					{ children }
				</H>
			</HeadingContainer>
		}
		else if ( line_1 ) {
			return <HeadingContainer link={ link }>
				<H className={ `${ common_classes } ${ classes } ${ font_family_class } ${ className }` } style={ style }>
					<span className="text-primary">{ with_line_breaks( line_1 ) }</span>
					<br />
					<span className="text-secondary">{ with_line_breaks( line_2 ) }</span>
				</H>
			</HeadingContainer>
		}
		else {
			return <HeadingContainer link={ link }>
				<H className={ `${ common_classes } ${ classes } text-secondary ${ className }` } style={ style }>{ with_line_breaks( line_2 ) }</H>
			</HeadingContainer>
		}
	}
}

function HeadingContainer ( { children, link } ) {
	if ( ! link ) {
		return children
	}

	return <Link to={ link.url } className="flex w-full justify-between items-center">
		{ children }
		<Button className="whitespace-nowrap">{ link.label }</Button>
	</Link>
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
	h1: "text-h1 text-primary font-bold",
	h2: "text-h3 md:text-h2 lg:text-h3 text-primary font-bold",
	h3: "text-h4 md:text-h2 lg:text-h4 text-primary font-bold",
	h4: "text-h5 md:text-h3 lg:text-h5 text-secondary font-bold",
	h5: "text-p md:text-h4 lg:text-p text-secondary font-bold",
	h6: "text-p text-secondary",
}
