
/**
 |
 | Image Link
 |
 |
 */

import { Link } from "react-router"

import { shallow_clone_props } from "../utilities/shallow-clone-props"

import { media_url } from "../media"
import { use_media_origin } from "../media-origin"

export class ImageLink {
	static id = "navigation.image-link-v1"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ image, link }) {
		const media_origin = use_media_origin()

		let props = { }
		if ( link.target ) {
			props.target = link.target
		}
		else if ( ! link.url.startsWith( "/" ) ) {
			props.target = "_blank"
		}

		return <Link to={ link.url } className="rounded-md overflow-hidden" { ...props }>
			<img src={ media_url( image.file.url, media_origin ) } alt={ image.file.alternativeText } className="object-cover" />
		</Link>
	}
}
