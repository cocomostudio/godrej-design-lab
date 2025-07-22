
/**
 |
 | Image and Content
 |
 |
 */

import { shallow_clone_props } from "../../utilities/shallow-clone-props"

import { Image } from "../../components/image"
import { WYSIWYG } from "../wysiwyg"

export class ImageAndContent {
	static id = "gdl.image-and-content-v1"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ image, content }) {
		return <div className="full-width mt-6 md:mt-8 lg:mt-10 | md:flex md:gap-1g">
			<div className="md:w-2c-1g lg:w-3c-2g">
				{ image?.file && <Image.Renderer file={ image.file } aspect_ratio={ image.aspect_ratio } className="!m-0" /> }
			</div>

			<div className="max-md:mt-4 md:w-5c-4g lg:w-6c-5g [&>:first-child]:mt-0 max-md:empty:hidden">
				<WYSIWYG.Renderer font_family="sans-serif" content={ content } />
			</div>
		</div>
	}
}
