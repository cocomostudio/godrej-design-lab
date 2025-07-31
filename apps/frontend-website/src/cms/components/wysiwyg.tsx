
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
import { Quote } from "~/__lib/react/quote"

import stylesheet from "./wysiwyg.css?url"

export class WYSIWYG {
	static id = "text.wysiwyg-v1"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ( { layout, font_family, content, className }: { layout: string, font_family?: string, content: unknown, className?: string } ) {
		const layout_class = layout === "full-width" ? "full-width" : ""
		const font_family_class = font_family === "monospace" ? "font-mono" : "font-sans"

		return <>
			<link rel="stylesheet" href={ stylesheet } precedence="medium" />

			<div className={ `wysiwyg mt-6 md:mt-8 lg:mt-10 ${ layout_class } [&>:first-child]:mt-0 ${ className }` }>
				<BlocksRenderer
					content={ content }
					blocks={{
						heading: ({ level, children }) => <Heading.Renderer level={ "h" + level } font_family={ font_family_class } className="normal-case" style={{ fontWeight: "normal" }}>
							{ children }
						</Heading.Renderer>,
						paragraph: props => <Paragraph font_family={ font_family_class } { ...props } />,
						link: ({ children, url }) => <Link to={ url }>{ children }</Link>,
						quote: ({ children }) => <Quote className={ font_family_class }>{ children }</Quote>,
						code: props => <Paragraph font_family="font-mono" { ...props } />,
							// ^ In this specific case, code blocks are not supported
							// 		and are rendered as paragraphs (with a monospaced font) instead.
						image: () => null,
						list: props => <List font_family={ font_family_class } { ...props } />,
					}}
					modifiers={{
						bold: ({ children }) => <strong className="font-bold">{ children }</strong>,
						italic: ({ children }) => <em className="italic">{ children }</em>,
						code: ({ children }) => <span className="font-mono">{ children }</span>,
						underline: ({ children }) => <u>{ children }</u>,
					}}
				/>
			</div>
		</>
	}
}

function Paragraph ({ font_family, children = null }) {
	return <p className={ `mt-6 md:mt-8 lg:mt-10 [.h+&]:mt-3 [.h+&]:md:mt-4 [.h+&]:lg:mt-5 text-p ${ font_family }` }>{ children }</p>
}

function List ({ format, font_family, children }) {
	const layout_in_two_columns = children.length >= 10
	const two_column_layout_classes = "columns-2 md:columns-2c-2g lg:columns-3c-1g"
	const L = format === "ordered" ? "ol" : "ul"
	const class_name = format === "ordered" ? "list-decimal list-inside" : "*:flex *:gap-2 *:before:content-['•'] *:before:mt-[0.25em] *:lg:before:mt-[0.5rem] *:before:text-2xs"
	return <L className={ `first:mt-0 ${ layout_in_two_columns ? two_column_layout_classes : "" } text-p ${ font_family } | ${ class_name }` }>
		{ children }
	</L>
}
