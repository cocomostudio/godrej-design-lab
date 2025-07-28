
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
import { useColorSchemeStyles } from "./use-color-scheme-styles"

export class PageLayout {
	static id = "container.page-layout-v1"

	static process_node ( props ) {
		const navigable_content = [
			...( props?.header_region?.content ?? [ ] ),
			...( props?.main_region?.content ?? [ ] ),
		]

		return {
			__component: PageLayout.id,
			__content: [
				new SideRegion( props.side_region, props.toc, navigable_content ),
				new HeaderRegion( props.header_region ),
				new MainRegion( props.main_region ),
			],
			side_region_empty: !props.side_region && !props.toc,
			toc: props.toc,
			navigable_content,
			meta: {
				title: props.title,
				description: props.description,
				cover: props.cover,
			},
			page_context: props.page_context,
			color_scheme: props.color_scheme,
		}
	}

	static Renderer ({ meta, page_context, color_scheme, children }) {
		const color_scheme_styles = useColorSchemeStyles( color_scheme )

		return <>
			<DocumentMeta
				title={ meta.title }
				site_title={ page_context.site_title }
				description={ meta.description || page_context.site_description }
				cover={ meta.cover || page_context.cover }
			/>

			<div style={ color_scheme_styles }>
				<Header navigation={ page_context.navigation } featured_links={ page_context.featured_links } />

				<div className="relative container max-md:flex flex-col">
					{ children }
				</div>

				<Footer navigation={ page_context.navigation } className="mt-10 md:mt-22" />
			</div>
		</>
	}
}
