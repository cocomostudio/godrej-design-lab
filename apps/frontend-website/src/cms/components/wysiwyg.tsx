
/**
 |
 | WYSIWYG
 |
 |
 */

import { Link } from "react-router"
import { BlocksRenderer } from "@strapi/blocks-react-renderer"

import { shallow_clone_props } from "../utilities/shallow-clone-props"
import { Heading } from "./heading"

export class WYSIWYG {
	static id = "text.wysiwyg-v1"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ( { font_family, content }: { font_family?: string, content: unknown } ) {
		const font_family_class = font_family === "monospace" ? "font-mono" : "font-sans"

		return <div className="mt-6 md:mt-8 lg:mt-10 [&>:first-child]:mt-0">
			<BlocksRenderer
				content={ content }
				blocks={{
					heading: ({ level, children }) => <Heading.Renderer level={ "h" + level } font_family={ font_family_class }>
						{ children }
					</Heading.Renderer>,
					paragraph: props => <Paragraph font_family={ font_family_class } { ...props } />,
					link: ({ children, url }) => <Link to={ url }>{ children }</Link>,
					code: Paragraph,
					image: () => null,
					list: props => <List font_family={ font_family_class } { ...props } />,
				}}
				modifiers={{
					bold: ({ children }) => <strong className="font-bold">{ children }</strong>,
					italic: ({ children }) => <em className="italic">{ children }</em>,
				}}
			/>
		</div>
	}
}

function Paragraph ({ font_family, children = null }) {
	return <p className={ `mt-6 md:mt-8 lg:mt-10 [.h+&]:mt-3 [.h+&]:md:mt-4 [.h+&]:lg:mt-5 text-p ${ font_family }` }>{ children }</p>
}

function List ({ format, font_family, children }) {
	const L = format === "ordered" ? "ol" : "ul"
	const class_name = format === "ordered" ? "list-decimal list-inside" : "*:flex *:gap-2 *:before:content-['•'] *:before:mt-[0.25em] *:lg:before:mt-[0.5rem] *:before:text-2xs"
	return <L className={ `first:mt-0 text-p ${ font_family } | ${ class_name }` }>
		{ children }
	</L>
}
