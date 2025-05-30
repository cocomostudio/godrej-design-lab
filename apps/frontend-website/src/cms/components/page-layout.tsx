
/**
 |
 | Page layout
 |
 |
 */

import { HeaderRegion } from "./header-region"
import { SideRegion } from "./side-region"
import { MainRegion } from "./main-region"

export class PageLayout {
	static id = "container.page-layout-v1"

	static process_node ( props ) {
		return {
			__component: PageLayout.id,
			__content: [
				new HeaderRegion( props.header_region ),
				new SideRegion( props.side_region ),
				new MainRegion( props.main_region ),
			]
		}
	}

	static Renderer ({ children }) {
		return <div className="relative container">
			<div className="md:ml-1c-1g lg:ml-2c-2g md:w-7c-6g lg:w-10c-9g">
				{ children }
			</div>
		</div>
	}
}
