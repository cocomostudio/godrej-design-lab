
/**
 |
 | Image and Content List
 |
 |
 */

import { shallow_clone_props } from "../../utilities/shallow-clone-props"

import { Image } from "../../components/image"
import { WYSIWYG } from "../wysiwyg"

export class ImageAndContentList {
	static id = "gdl.image-and-content-list-v1"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ layout, content }) {
		const imageIsLeftAligned = layout === "image | content"
		return <ul className="full-width mt-6 md:mt-8 lg:mt-10 space-y-6 md:space-y-8 lg:space-y-10">
			{ content.map( ({ image, content }, i ) => <li key={ i } className="md:flex md:gap-1g border-b border-black/30 last:border-0 pb-6 md:pb-8 lg:pb-10 last:pb-0">
				{ imageIsLeftAligned && <div className="md:w-2c-1g lg:w-3c-2g">
					{ image?.file && <Image.Renderer file={ image.file } aspect_ratio={ image.aspect_ratio } className="!m-0" /> }
				</div> }

				<div className={ `${ imageIsLeftAligned ? "max-md:mt-4" : "" } md:w-5c-4g lg:w-6c-5g [&>:first-child]:mt-0 max-md:empty:hidden` }>
					<WYSIWYG.Renderer font_family="sans-serif" content={ content } />
				</div>

				{ !imageIsLeftAligned && <div className="max-md:mt-4 md:w-2c-1g lg:w-3c-2g">
					{ image?.file && <Image.Renderer file={ image.file } aspect_ratio={ image.aspect_ratio } className="!m-0" /> }
				</div> }
			</li> ) }
		</ul>
	}
}
