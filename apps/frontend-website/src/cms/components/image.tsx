
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

	static Renderer ({ file }) {
		return <figure className="rounded-md overflow-hidden">
			<img src={ CMS_PUBLIC_DIR_URL + file.url } alt={ file.alternativeText } className="md:aspect-square object-cover" />
		</figure>
	}
}
