
/**
 |
 | Image component
 |
 |
 */

import { shallow_clone_props } from "../utilities/shallow-clone-props"

import { CMS_PUBLIC_DIR_URL } from "env"
import stylesheet from "./image.css?url"

export class Image {
	static id = "media.image-v1"

	constructor ( file ) {
		return {
			__component: Image.id,
			file,
		}
	}

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ file, aspect_ratio = "natural", className = null }: { file: unknown, aspect_ratio?: string, className?: string | null }) {
		const { src, src_set } = useImageURLs( file )
		let rest_props = { }
		if ( src_set ) {
			rest_props.srcSet = src_set
		}
		return <>
			<link rel="stylesheet" href={ stylesheet } precedence="medium" />
			<figure className={ `image mt-6 md:mt-8 lg:mt-10 _overflow-hidden ${ className }` }>
				<img decoding="async" src={ src } alt={ file.alternativeText } className={ `${ aspect_ratio_to_class__map[ aspect_ratio ] } object-cover rounded-md` } loading="lazy" { ...rest_props } />
				{ file.caption && <figcaption className="mt-2 font-mono text-xs">{ file.caption }</figcaption> }
			</figure>
		</>
	}
}

const aspect_ratio_to_class__map = {
	"natural": "",
	"1:1 (square)": "aspect-square",
}





/*
 |
 | Parse through the image file object (returned from Strapi)
 |
 | Return the src and src_set values
 |
 */
type UseImageURLsArgs = [
	data: Record<PropertyKey, unknown> | null | undefined,
	variant?: "XXS" | "XS" | "SM" | "MD" | "LG" | "XL",
	fallback?: string,
]
function useImageURLs ( ...[ data, variant, fallback ]: UseImageURLsArgs ) {
	let images = [ ]
	if ( data ) {
		if ( data?.provider === "local" ) {
			for ( let currrent_variant in data.formats ) {
				const image = data.formats[ currrent_variant ]
				images.push( {
					variant: currrent_variant.toUpperCase(),
					url: CMS_PUBLIC_DIR_URL + image.url,
					w: image.width
				} )
			}
		}
	}

	let srcURL: string
	if ( images.length > 0 ) {
		srcURL = images.find( i => i.variant === variant )?.url
		if ( ! srcURL ) {
			srcURL = images[ 0 ].url
		}
	}
	else /* if ( images.length === 0 ) */ {
		if ( fallback ) {
			srcURL = fallback.startsWith( "https://" )
				? fallback
				: CMS_PUBLIC_DIR_URL + fallback
		}
		else {
			srcURL = CMS_PUBLIC_DIR_URL + FALLBACK_IMAGE
			// ^ If the "default" fallback image is being used,
			// 		then there is no need for a `srcSet`.
			// 	In fact, when the `srcSet` is the same as the srcURL,
			// 		but with a `100w` suffix, browsers hang.
			// 		It's a genuine bug.
		}
	}

	return {
		src: srcURL,
		src_set: images.length === 0
			? undefined
			: images
				.map( ({ url, w }) => `${ url } ${ w }w` )
				.join( ", " ),
	}
}

const FALLBACK_IMAGE = "/media/backgrounds/background-texture.jpg"
