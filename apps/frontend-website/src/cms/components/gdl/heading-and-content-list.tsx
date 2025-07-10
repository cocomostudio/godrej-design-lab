
/**
 |
 | Heading and Content List
 |
 |
 */

import { NEW_LINES_REGEX } from "~/__lib/strings/regular-expressions"
import { shallow_clone_props } from "../../utilities/shallow-clone-props"
import { WYSIWYG } from "../wysiwyg"

export class HeadingAndContentList {
	static id = "gdl.heading-and-content-list-v1"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ content }) {
		return <ul className="!mt-8">
			{ content.map( ({ heading, content }, i ) => <li key={ i } className="mt-6 md:mt-8 lg:mt-10 md:flex md:gap-1g border-b border-black/30 pb-6 md:pb-8 lg:pb-10">
				<h3 className="md:w-2c-1g lg:w-3c-2g text-h4 font-bold uppercase text-secondary" dangerouslySetInnerHTML={{ __html: heading.replace( NEW_LINES_REGEX, html_line_break ) }}></h3>

				<div className="md:ml-1g md:w-5c-4g lg:w-6c-5g [&>:first-child]:mt-0 max-md:empty:hidden">
					<WYSIWYG.Renderer font_family="sans-serif" content={ content } />
				</div>
			</li> ) }
		</ul>
	}
}

const html_line_break = "<br/>"
