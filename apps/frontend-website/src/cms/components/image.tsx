
/**
 |
 | Image
 |
 |
 */

import { shallow_clone_props } from "../utilities/shallow-clone-props"

import { CMS_PUBLIC_DIR_URL } from "env"

export class Image {
	static id = "media.image-v1"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ file, aspect_ratio }) {
		return <figure className="mt-6 md:mt-8 lg:mt-10 rounded-md overflow-hidden">
			<img src={ CMS_PUBLIC_DIR_URL + file.url } alt={ file.alternativeText } className={ `${ aspect_ratio_to_class__map[ aspect_ratio ] } object-cover` } loading="lazy" />
		</figure>
	}
}

const aspect_ratio_to_class__map = {
	"natural": "",
	"1:1 (square)": "aspect-square",
}
