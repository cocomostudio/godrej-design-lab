
/**
 |
 | WYSIWYG
 |
 |
 */

import { BlocksRenderer } from "@strapi/blocks-react-renderer"

import { shallow_clone_props } from "../utilities/shallow-clone-props"
import { Heading } from "./heading"

export class WYSIWYG {
	static id = "text.wysiwyg-v1"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ font_family, content }) {
		const font_family_class = font_family === "monospace" ? "font-mono" : "font-sans"
		return <BlocksRenderer
			content={ content }
			blocks={{
				heading: ({ level, children }) => <Heading.Renderer level={ "h" + level } primary_heading={ children } font_family={ font_family_class } />,
				paragraph: ({ children }) => <p className={ `mt-6 md:mt-8 lg:mt-10 text-p ${ font_family_class }` }>{ children }</p>
			}}
		/>
	}
}
