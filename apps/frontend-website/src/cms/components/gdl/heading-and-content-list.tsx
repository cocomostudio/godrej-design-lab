
/**
 |
 | Heading and Content List
 |
 |
 */

import { H } from "react-accessible-headings"

import { shallow_clone_props } from "../../utilities/shallow-clone-props"
import { WYSIWYG } from "../wysiwyg"
import { with_line_breaks } from "~/__lib/react/line-breaks"

export class HeadingAndContentList {
	static id = "gdl.heading-and-content-list-v1"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ content }) {
		return <ul className="full-width mt-6 md:mt-8 lg:mt-10">
			{ content.map( ({ heading, content }, i ) => <li key={ i } className="mt-6 md:mt-8 lg:mt-10 first:mt-0 md:flex md:gap-1g border-b border-black/30 last:border-0 pb-6 md:pb-8 lg:pb-10 last:pb-0">
				<H className="md:w-2c-1g lg:w-3c-2g text-h4 font-bold uppercase text-secondary">{ with_line_breaks( heading ) }</H>

				<div className="max-md:mt-6 md:w-5c-4g lg:w-6c-5g [&>:first-child]:mt-0 max-md:empty:hidden">
					<WYSIWYG.Renderer font_family="sans-serif" content={ content } />
				</div>
			</li> ) }
		</ul>
	}
}
