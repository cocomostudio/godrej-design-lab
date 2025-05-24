
/**
 |
 | Section
 |
 |
 */

import { relocate_content_attribute } from "../utilities/relocate-content-attribute"

export class Section {
	static id = "container.section-v1"

	static process_node ( props ) {
		return relocate_content_attribute( props )
	}

	static Renderer ({ children }) {
		return <section className="mt-6 md:mt-8 lg:mt-10 first:mt-0 container flex flex-col _max-md:flex-col flex-wrap">
			{ children }
		</section>
	}
}
