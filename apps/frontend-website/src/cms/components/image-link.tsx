
/**
 |
 | Image Link
 |
 |
 */

import { Link } from "react-router"

import { shallow_clone_props } from "../utilities/shallow-clone-props"

import { CMS_PUBLIC_DIR_URL } from "env"

export class ImageLink {
	static id = "navigation.image-link-v1"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ image, link }) {
		return <Link to={ link.url } className="rounded-md overflow-hidden">
			<img src={ CMS_PUBLIC_DIR_URL + image.file.url } alt={ image.file.alternativeText } className="object-cover" />
		</Link>
	}
}
