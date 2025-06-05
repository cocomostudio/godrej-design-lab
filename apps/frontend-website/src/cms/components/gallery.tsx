
/**
 |
 | Gallery
 |
 |
 */

import { shallow_clone_props } from "../utilities/shallow-clone-props"

import { Image } from "./image"

export class Gallery {
	static id = "media.gallery-v1"

	static process_node ( props ) {
		return {
			__component: Gallery.id,
			__content: props.content
				.map( function ({ layout, images }) {
					return images.map( function ( image, index ) {
						return new GalleryItem(
							get_relative_width( layout, index ),
							new Image( image )
						)
					} )
				} )
				.flatMap( e => e )
		}
	}

	static Renderer ({ children }) {
		return <ul className="mt-6 md:mt-8 lg:mt-10 flex flex-col md:flex-row flex-wrap gap-1g">{ children }</ul>
	}
}

export class GalleryItem {
	static id = "media.gallery-item-v1"

	constructor ( relative_width, content ) {
		return {
			__component: GalleryItem.id,
			relative_width,
			__content: content,
		}
	}

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ relative_width, children }) {
		return <li
			className="md:h-100 lg:h-150 max-md:!w-auto *:h-full [&_img]:size-full | [&>figure]:mt-0"
			style={{
				width: relative_width_map[ relative_width ],
			}}>
			{ children }
		</li>
	}
}

function get_relative_width ( layout: string, position_index: number ) {
	const images_per_row = layout_to_images_per_row[ layout ]
	const relative_position_index = position_index % images_per_row
	return image_position_to_relative_width[ layout ][ relative_position_index ]
}

const layout_to_images_per_row = {
	"1": 1,
	"1:1": 2,
	"1:2": 2,
	"2:1": 2,
	"1:1:1": 3,
} as const
const image_position_to_relative_width = {
	"1": [ "3/3" ],
	"1:1": [ "1/2", "1/2" ],
	"1:2": [ "1/3", "2/3" ],
	"2:1": [ "2/3", "1/3" ],
	"1:1:1": [ "1/3", "1/3", "1/3" ]
} as const

const one_tile_width = "( ( 100% - ( 2 * var( --gutter-width ) ) ) / 3 )"
const relative_width_map = {
	"1/2": `calc( ( 100% - var( --gutter-width ) ) / 2 )`,
	"1/3": `calc( ${ one_tile_width } )`,
	"2/3": `calc( ( 2 * ${ one_tile_width } ) + ( 1 * var( --gutter-width ) ) )`,
	"3/3": "100%",
	"1": "100%",
}
