
/**
 |
 | Page layout
 |
 |
 */

import { HeaderRegion } from "../header-region"
import { SideRegion } from "../side-region"
import { MainRegion } from "../main-region"
import { DocumentMeta } from "./document-meta"
import { Header } from "./header"
import { Footer } from "./footer"

export class PageLayout {
	static id = "container.page-layout-v1"

	static process_node ( props ) {
		return {
			__component: PageLayout.id,
			__content: [
				new HeaderRegion( props.header_region ),
				new SideRegion( props.side_region ),
				new MainRegion( props.main_region ),
			],
			meta: {
				title: props.title,
				description: props.description,
				cover: props.cover,
			},
			page_context: props.page_context,
		}
	}

	static Renderer ({ meta, page_context, children }) {
		return <>
			<DocumentMeta
				title={ meta.title }
				site_title={ page_context.site_title }
				description={ meta.description || page_context.site_description }
				cover={ meta.cover || page_context.cover }
			/>

			<div className="bg-white">
				<Header navigation={ page_context.navigation } featured_links={ page_context.featured_links } />

				<div className="relative container max-md:flex flex-col">
					{ children }
				</div>

				<Footer navigation={ page_context.navigation } className="mt-22" />
			</div>
		</>
	}
}
