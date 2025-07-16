
/**
 |
 | Post Listing
 |
 |
 */

import { Link } from "react-router"

import { shallow_clone_props } from "../../utilities/shallow-clone-props"
import { Image } from "../image"
import { WYSIWYG } from "../wysiwyg"

export class PostListing {
	static id = "gdl.post-listing-v1"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ content, layout, feature_first_post }) {
		let layout_classes = ""
		if ( layout === "2-column" ) {
			layout_classes = "md:*:w-[calc((100%-var(--gutter-width))/2)]"
		}
		else /* if ( layout === "3-column" ) */ {
			layout_classes = "md:*:w-[calc((100%-(2*var(--gutter-width)))/3)]"
		}

		let first_post
		let posts = content
		if ( feature_first_post ) {
			[ first_post, ...posts ] = content
		}

		return <ul className={ `mt-6 md:mt-8 lg:mt-10 flex flex-wrap flex-col md:flex-row gap-1g ${ layout_classes }` }>
			{ first_post && <FeaturedPost { ...first_post } /> }
			{ posts.map( ({ image, content, link }, i ) => <li key={ i }>
				<Link to={ link }>
					<Image.Renderer file={ image } className="!m-0 h-64 md:h-88 lg:h-122 [&_img]:size-full [&_figcaption]:hidden" />

					<WYSIWYG.Renderer font_family="sans-serif" content={ content } className="!mt-4 lg:!mt-6 | space-y-3.5 md:space-y-4" />
				</Link>
			</li> ) }
		</ul>
	}
}


function FeaturedPost ({ image, content, link }) {
	return <li style={{ width: "100%" }}>
		<Link to={ link }>
			<Image.Renderer file={ image } className="!m-0 h-64 md:h-150 lg:h-214 [&_img]:size-full [&_figcaption]:hidden" />

			<WYSIWYG.Renderer font_family="sans-serif" content={ content } className="!mt-4 lg:!mt-6 md:ml-[calc((100%/2)+(var(--gutter-width)/2))] | space-y-3.5 md:space-y-4" />
		</Link>
	</li>
}
