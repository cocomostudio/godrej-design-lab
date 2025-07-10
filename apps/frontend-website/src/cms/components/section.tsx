
/**
 |
 | Section
 |
 |
 */

import { relocate_content_attribute } from "../utilities/relocate-content-attribute"
import { Heading } from "./heading"
import { HorizontalRule } from "./horizontal-rule"

export class Section {
	static id = "container.section-v1"

	static process_node ( props ) {
		return relocate_content_attribute( props )
	}

	static Renderer ({ register_with_toc, title, heading, children }) {
		let attributes = { }
		if (
			register_with_toc
			&& ( title && title.trim() )
		) {
			attributes.id = title.replace( /\s+/g, "-" ).toLowerCase()
		}
		return <section className="mt-6 md:mt-8 lg:mt-10 [&>:first-child]:mt-0 container flex flex-col _max-md:flex-col flex-wrap" { ...attributes }>
			{ heading && <Heading.Renderer { ...heading } /> }
			{ children }
			{ children.length > 0 && <HorizontalRule.Renderer shade="dark" /> }
		</section>
	}
}
