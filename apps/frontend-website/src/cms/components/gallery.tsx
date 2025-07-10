
/**
 |
 | Gallery
 |
 |
 */

import type {
	MediaGallery1ImageSetV1,
	MediaGallery2ImageSetV1,
	MediaGallery3ImageSetV1,
} from "cms/components"
import type { APICommonAttributes } from "~/__lib/strapi/component"
import type { Simplify } from "@this/typescript/utilities/simplify.js"

import {
	Fragment
} from "react"

import { Image } from "./image"
import { chunk } from "~/__lib/lists/chunk"

import stylesheet from "./gallery.css?url"

type NodeProps = {
	content: Array<
		| Simplify<MediaGallery1ImageSetV1[ "attributes" ] & { __component: "media.gallery-1-image-set-v1" } & APICommonAttributes>
		| Simplify<MediaGallery2ImageSetV1[ "attributes" ] & { __component: "media.gallery-2-image-set-v1" } & APICommonAttributes>
		| Simplify<MediaGallery3ImageSetV1[ "attributes" ] & { __component: "media.gallery-3-image-set-v1" } & APICommonAttributes>
	>
}
export class Gallery {
	static id = "media.gallery-v1"

	static process_node ( props: NodeProps ) {
		return {
			__component: Gallery.id,
			content: props.content
				.map( function ({ layout, images }) {
					return {
						layout,
						images: images.map( function ( image, index ) {
							return {
								...image,
								relative_width: get_relative_width( layout, index )
							}
						} )
					}
				} )
				.map( function ({ layout, images }) {
					return chunk( images, layout_to_images_per_row[ layout ] )
				} )
				.flatMap( e => e )
		}
	}

	static Renderer ({ content }) {
		return <>
			<link rel="stylesheet" href={ stylesheet } precedence="medium" />
			<ul className="mt-6 md:mt-8 lg:mt-10 | space-y-1g">
				{ content.map( ( row, i ) => <ImageRow key={ i } images={ row } /> ) }
			</ul>
		</>
	}
}

function ImageRow ({ images }) {
	return <div className="image-context relative flex">
		<CaptionsPane images={ images } />
		<ImageList images={ images } />
	</div>
}

function CaptionsPane ( { images } ) {
	return <div className="max-lg:hidden absolute right-full mr-1g h-full flex">
		<ol aria-hidden={ true } className="caption-list mt-auto mb-0 flex flex-col w-2c-1g">
			{ images.map( ( image, i ) => <li key={ i } className="image-caption py-4">
				<p className="empty:hidden relative font-mono text-sm" data-index={ i + 1 }>{ image.caption }</p>
			</li> ) }
		</ol>
	</div>
}

function ImageList ( { images } ) {
	return images.map( ( image, i ) => <Fragment key={ i }>
		<li
			className="image-container box-content max-md:!w-auto | [&>figure]:mt-0 md:[&_img]:w-full md:[&_img]:h-100 lg:[&_img]:h-150"
			style={{
				width: relative_width_map[ image.relative_width ],
			}}
		>
			<Image.Renderer file={ image } aspect_ratio={ image.aspect_ratio } className="box-border lg:[&_figcaption]:hidden" />
		</li>
	</Fragment> )
}

function get_relative_width ( layout: string, position_index: number ) {
	const images_per_row = layout_to_images_per_row[ layout ]
	const relative_position_index = position_index % images_per_row
	return image_position_to_relative_width[ layout ][ relative_position_index ]
}

// The number of images per row, based on the layout configuration
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
} as const
