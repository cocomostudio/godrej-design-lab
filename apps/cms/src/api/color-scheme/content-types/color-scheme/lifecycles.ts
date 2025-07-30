
/**
 |
 | Color Scheme lifecycle hooks
 |
 |
 */

// import { hex_to_rgb } from "@this/lib/colors/hex-to-rgb"





// Color field mappings
const color_fields = [
	{ hex: "primary_color_hex", rgb: "primary_color_rgb" },
	{ hex: "secondary_color_hex", rgb: "secondary_color_rgb" },
]

export default {
	async beforeCreate ( event ) {
		set_rgb_fields( event.params.data )
	},

	async beforeUpdate ( event ) {
		set_rgb_fields( event.params.data )
	},
}


function set_rgb_fields ( data ) {
	for ( const field of color_fields ) {
		if ( ! data[ field.hex ] ) {
			continue
		}

		// Convert hex values to RGB values
		const rgb = get_rgb_channels_as_string( data[ field.hex ] )
		if ( rgb ) {
			data[ field.rgb ] = rgb
		}
	}
}

function get_rgb_channels_as_string ( hex ) {
	const rgb = hex_to_rgb( hex ) as any
	return `${ rgb.red }, ${ rgb.green }, ${ rgb.blue }`
}


/**
 |
 | Reference: https://github.com/sindresorhus/hex-rgb
 |
 |
 */

const hexCharacters = "a-f\\d"
const match3or4Hex = `#?[${hexCharacters}]{3}[${hexCharacters}]?`
const match6or8Hex = `#?[${hexCharacters}]{6}([${hexCharacters}]{2})?`
const nonHexChars = new RegExp(`[^#${hexCharacters}]`, "gi" )
const validHexSize = new RegExp(`^${match3or4Hex}$|^${match6or8Hex}$`, "i" )

export function hex_to_rgb ( hex: string, options: any = { } ) {
	if ( nonHexChars.test( hex ) || !validHexSize.test( hex ) ) {
		throw new TypeError( "Expected a valid hex string" )
	}

	hex = hex.replace( /^#/, "" )
	let alphaFromHex = 1

	if ( hex.length === 8 ) {
		alphaFromHex = Number.parseInt( hex.slice( 6, 8 ), 16 ) / 255
		hex = hex.slice( 0, 6 )
	}

	if ( hex.length === 4 ) {
		alphaFromHex = Number.parseInt( hex.slice( 3, 4 ).repeat( 2 ), 16 ) / 255
		hex = hex.slice( 0, 3 )
	}

	if ( hex.length === 3 ) {
		hex = hex[ 0 ] + hex[ 0 ] + hex[ 1 ] + hex[ 1 ] + hex[ 2 ] + hex[ 2 ]
	}

	const number = Number.parseInt( hex, 16 )
	const red = number >> 16
	const green = ( number >> 8 ) & 255
	const blue = number & 255
	const alpha = typeof options.alpha === "number" ? options.alpha : alphaFromHex

	if ( options.format === " array" ) {
		return [ red, green, blue, alpha ]
	}

	if ( options.format === "css" ) {
		const alphaString = alpha === 1 ? "" : ` / ${Number( ( alpha * 100 ).toFixed( 2 ) )}%`
		return `rgb(${red} ${green} ${blue}${alphaString})`
	}

	return { red, green, blue, alpha }
}
