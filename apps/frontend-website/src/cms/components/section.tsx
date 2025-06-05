
/**
 |
 | Section
 |
 |
 */

import { relocate_content_attribute } from "../utilities/relocate-content-attribute"
import { Heading } from "./heading"

export class Section {
	static id = "container.section-v1"

	static process_node ( props ) {
		return relocate_content_attribute( props )
	}

	static Renderer ({ title, heading, children }) {
		return <section className="mt-6 md:mt-8 lg:mt-10 [&>:first-child]:mt-0 container flex flex-col _max-md:flex-col flex-wrap">
			{ heading && <Heading.Renderer { ...heading } /> }
			{ children }
		</section>
	}
}
