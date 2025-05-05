
import type { Config } from "tailwindcss"

import plugin from "tailwindcss/plugin"
import defaultTheme from "tailwindcss/defaultTheme"





/**
 |
 | Spacings
 |
 |
 */
const numericSpacings: Record<PropertyKey, string> = [ ...Array( 1000 + 1 ) ]
	.map( ( _, i ) => i * 0.25 )
	.reduce( function ( acc, n ) {
		return {
			...acc,
			[ n ]: `${ ( n * 4 ) / 16 }rem`,
		}
	}, {
		"px": `${ 1 / 16 }rem`,
	} )

function calculateGridSpacing ( c: number, g: number ) {
	return `calc( ( ${ c } * var( --column-width ) ) + ( ${ g } * var( --gutter-width ) ) )`
}
function calculateGridSpacings () {
	const spacings: Record<PropertyKey, string> = { }

	for ( let c = 0; c <= 12; c += 1 ) {
		spacings[ `${ c }c` ] = calculateGridSpacing( c, 0 )
		for ( let g = 0; g <= 11; g += 1 ) {
			spacings[ `${ c }c-${ g }g` ] = calculateGridSpacing( c, g )
		}
	}
	for ( let g = 0; g <= 11; g += 1 ) {
		spacings[ `${ g }g` ] = calculateGridSpacing( 0, g )
		for ( let c = 0; c <= 12; c += 1 ) {
			spacings[ `${ g }g-${ c }c` ] = calculateGridSpacing( c, g )
		}
	}

	return spacings
}
const gridSpacings = calculateGridSpacings()

const spacings: Record<PropertyKey, string> = {
	...numericSpacings,
	...gridSpacings,
}

const spacingPlugin = plugin( ({ addBase }) => {
	addBase({
		":root": {
			"--spacing-unit": spacings[ "1" ],
		}
	} )
} )


/**
 |
 | Sizes
 |
 |
 */
const viewportSizes = [
	{
		name: "sm",
		width: 390,
		contentWidth: 358,
	},
	{
		name: "md",
		width: 1194,
		contentWidth: 1146,
	},
	{
		name: "lg",
		width: 1920,
		contentWidth: 1824,
	},
] as const
type ViewportSizes = typeof viewportSizes

const viewportSizes__asRecord = viewportSizes.reduce( function ( acc, size ) {
	return {
		...acc,
		[ size.name ]: size,
	}
}, { } as Record<ViewportSizes[ number ][ "name" ], ViewportSizes[ number ]> )

const viewportSizesInPixels = viewportSizes.reduce( function ( acc, size ) {
	return {
		...acc,
		[ size.name ]: size.width + "px",
	}
}, { } as Record<ViewportSizes[ number ][ "name" ], `${ ViewportSizes[ number ][ "width" ] }px`> )


/**
 |
 | Layout and Containers
 |
 |
 */
const layoutAndContainersPlugin = plugin( ({ addUtilities, matchUtilities, addBase, addComponents }) => {

	/**
	 | Content widths
	 |
	 */
	addBase( {
		":root": {
			"--content-width": "300px",
			// ^ this number has just been plucked out of thin air
			"@media screen( sm )": {
				"--content-width": `${ viewportSizes__asRecord.sm.contentWidth }px`,
			},
			"@media screen( md )": {
				"--content-width": `${ viewportSizes__asRecord.md.contentWidth }px`,
			},
			"@media screen( lg )": {
				"--content-width": `${ viewportSizes__asRecord.lg.contentWidth }px`,
			},
		},
	} )

	/**
	 | Page layout
	 |
	 */
	addBase( {
		":root": {
			"--page-width": "calc( 100vw - var( --vertical-scrollbar-width, calc( 100vw - 100% ) ) )",
		}
	} )


	addComponents( {
		".container": {
			boxSizing: "border-box",
			// position: "relative",
			width: "100%",
			maxWidth: "var( --content-width )",
			marginLeft: "auto",
			marginRight: "auto",
			"& > *": {
				boxSizing: "border-box",
			},
		},
	} )
} )


/**
 |
 | Grid, Rows and Columns
 |
 |
 */
const gridPlugin = plugin( ({ addBase, matchUtilities, addComponents }) => {
	addBase( {
		":root": {
			"@media screen( sm )": {
			// [`@media ( min-width: ${viewportSizesInPixels.sm} )`]: {
				"--gutter-width": "1rem",
				"--column-width": "calc( ( var( --content-width ) - ( 4 * var( --gutter-width ) ) ) / 5 )",
			},
			"@media screen( md )": {
			// [`@media ( min-width: ${viewportSizesInPixels.md} )`]: {
				"--gutter-width": "1rem",
				"--column-width": "calc( ( var( --content-width ) - ( 7 * var( --gutter-width ) ) ) / 8 )",
			},
			"@media screen( lg )": {
			// [`@media ( min-width: ${viewportSizesInPixels.lg} )`]: {
				"--gutter-width": "1.25rem",
				"--column-width": "calc( ( var( --content-width ) - ( 11 * var( --gutter-width ) ) ) / 12 )",
			},
		},
	} )


	// Helper utilities, used in the `matchUtilities` function below
	const trackSpecifierRegex = /^\d{0,2}[cg]$/
	function getAdjacentSpecifierType ( type: "c" | "g" ) {
		return type === "c" ? "g" : "c"
	}

	function getColumnAndGutterCount ( rawSpecifier: string ) {
		const specifiers = rawSpecifier.split( "-" )

		// There can be 1, 2, or 3 specifiers; not less nor more.
		if ( specifiers.length < 1 || specifiers.length > 3 ) {
			return { }
		}

		// The specifiers should follow the pattern: <number?><c|g>
		const thereAreAnyInvalidSpecifiers = specifiers.some( s => {
			return ! trackSpecifierRegex.test( s )
		} )
		if ( thereAreAnyInvalidSpecifiers ) {
			return { }
		}

		// Expand the all possible notation to the full longhand (3-specifier) notation
		let fullSpecification: string[]
		if ( specifiers.length === 1 ) {
			const adjacentSpecifier = "0" + getAdjacentSpecifierType( specifiers[ 0 ].slice( -1 ) )
			fullSpecification = [ adjacentSpecifier ].concat( specifiers ).concat( adjacentSpecifier )
		}
		else if ( specifiers.length === 2 ) {
			// Should the `adjacentSpecifier` be added to the beginning or the end?
			// This is determined by the size of the first specifier.
			const firstSpecifierSize = parseInt( specifiers[ 0 ].slice( 0, -1 ) || "1", 10 )
			if ( firstSpecifierSize <= 1 ) {
				const adjacentSpecifierType = getAdjacentSpecifierType( specifiers[ 1 ].slice( -1 ) )
				const adjacentSpecifier = "0" + adjacentSpecifierType
				fullSpecification = specifiers.concat( adjacentSpecifier )
			}
			else {
				const adjacentSpecifierType = getAdjacentSpecifierType( specifiers[ 0 ].slice( -1 ) )
				const adjacentSpecifier = "0" + adjacentSpecifierType
				fullSpecification = [ adjacentSpecifier ].concat( specifiers )

				// Ensure that the third specifier does not exceed 1
				const thirdSpecifierSize = parseInt( fullSpecification[ 2 ].slice( 0, -1 ) || "1", 10 )
				if ( thirdSpecifierSize > 1 ) {
					return { }
				}
			}
		}
		else if ( specifiers.length === 3 ) {
			// Ensure that the first and third specifiers do not exceed 1
			const firstSpecifierSize = parseInt( specifiers[ 0 ].slice( 0, -1 ) || "1", 10 )
			const thirdSpecifierSize = parseInt( specifiers[ 2 ].slice( 0, -1 ) || "1", 10 )
			if ( firstSpecifierSize > 1 || thirdSpecifierSize > 1 ) {
				return { }
			}

			fullSpecification = [ ...specifiers ]
		}

		// No two consecutive specifiers should be of the same type, i.e. `c` or `g`
		const specifierSuffixes = fullSpecification
			.map( s => s[ s.length - 1 ] )
		const specifierSuffixesString = specifierSuffixes
			.join( "" )
		if (
			specifierSuffixesString !== "cgc"
			&& specifierSuffixesString !== "gcg"
		) {
			return { }
		}

		const specifierSizes = fullSpecification.map( s => parseInt( s.slice( 0, -1 ) || "1", 10 ) )
		let numberOfColumns = 0
		let numberOfGutters = 0
		if ( specifierSuffixes[ 1 ] === "c" ) {
			numberOfColumns = specifierSizes[ 1 ]
			numberOfGutters = specifierSizes[ 1 ] - 1

			numberOfGutters += specifierSizes[ 0 ] + specifierSizes[ 2 ]
		}
		else {
			numberOfGutters = specifierSizes[ 1 ]
			numberOfColumns = specifierSizes[ 1 ] - 1

			numberOfColumns += specifierSizes[ 0 ] + specifierSizes[ 2 ]
		}

		return {
			columns: numberOfColumns,
			gutters: numberOfGutters,
		}
	}

	matchUtilities( {
		"w-span": ( value: string ) => {
			const { columns, gutters } = getColumnAndGutterCount( value )
			return {
				width: `calc( ( ${ columns } * var( --column-width ) ) + ( ${ gutters } * var( --gutter-width ) ) )`,
			}
		},
		"max-w-span": ( value: string ) => {
			const { columns, gutters } = getColumnAndGutterCount( value )
			return {
				maxWidth: `calc( ( ${ columns } * var( --column-width ) ) + ( ${ gutters } * var( --gutter-width ) ) )`,
			}
		}
	} )

	addComponents( {
		".grid-layout": {
			display: "grid",
			[`@media ( min-width: ${viewportSizesInPixels.sm} )`]: {
				gridTemplateColumns: "repeat( 4, [col-start] minmax( 0, 1fr ) [col-end gutter-start] var( --gutter-width ) [gutter-end] ) [col-start] minmax( 0, 1fr ) [col-end]",
			},
			[`@media ( min-width: ${viewportSizesInPixels.md} )`]: {
				gridTemplateColumns: "repeat( 7, [col-start] minmax( 0, 1fr ) [col-end gutter-start] var( --gutter-width ) [gutter-end] ) [col-start] minmax( 0, 1fr ) [col-end]",
			},
			[`@media ( min-width: ${viewportSizesInPixels.lg} )`]: {
				gridTemplateColumns: "repeat( 11, [col-start] minmax( 0, 1fr ) [col-end gutter-start] var( --gutter-width ) [gutter-end] ) [col-start] minmax( 0, 1fr ) [col-end]",
			},
		},
		// ".no-wrap-grid-layout": {
		// 	display: "inline-flex",
		// 	"& > .col-span-4": {
		// 		width: "calc( ( 4 * var( --column-width ) ) + ( 3 * var( --gutter-width ) ) )",
		// 	},
		// 	"& > .col-span-5": {
		// 		width: "calc( ( 5 * var( --column-width ) ) + ( 4 * var( --gutter-width ) ) )",
		// 	},
		// 	"& > .col-span-6": {
		// 		width: "calc( ( 6 * var( --column-width ) ) + ( 5 * var( --gutter-width ) ) )",
		// 	},
		// },
	} )

	matchUtilities( {
		"start-col": ( value: string ) => {
			const [ n, position ] = value.split( "-" )
			return {
				gridColumnStart: `col-${ position || "start" } ${ n }`,
			}
		},
	}, {
		values: Object.fromEntries(
			[ ...Array( 13 ) ]
				// ^ max number of columns (i.e. 12) plus one = 13
				.map( ( _, i ) => ( i + 1 ) )
				.map( n => {
					return [
						[ `${ n }-start`, `${ n }-start` ],
						[ n, n.toString() ],
						[ `${ n }-end`, `${ n }-end` ],
					]
				} )
				.flat(),
		)
	} )
	matchUtilities( {
		"end-col": ( value: string ) => {
			const [ n, position ] = value.split( "-" )
			return {
				gridColumnEnd: `col-${ position || "end" } ${ n === "last" ? "-1" : n }`,
			}
		},
	}, {
		values: Object.fromEntries(
			[ ...Array( 13 ) ]
				// ^ max number of columns (i.e. 12) plus one = 13
				.map( ( _, i ) => ( i + 1 ) )
				.concat( "last" )
				.map( n => {
					return [
						[ `${ n }-start`, `${ n }-start` ],
						[ n, n.toString() ],
						[ `${ n }-end`, `${ n }-end` ],
					]
				} )
				.flat(),
		)
	} )

	matchUtilities( {
		"start-gutter": ( value: string ) => {
			const [ n, position ] = value.split( "-" )
			return {
				gridColumnStart: `gutter-${ position || "start" } ${ n }`,
			}
		},
	}, {
		values: Object.fromEntries(
			[ ...Array( 12 ) ]
				// ^ max number of gutters (i.e. 11) plus one = 12
				.map( ( _, i ) => ( i + 1 ) )
				.map( n => {
					return [
						[ `${ n }-start`, `${ n }-start` ],
						[ n, n.toString() ],
						[ `${ n }-end`, `${ n }-end` ],
					]
				} )
				.flat(),
		)
	} )
	matchUtilities( {
		"end-gutter": ( value: string ) => {
			const [ n, position ] = value.split( "-" )
			return {
				gridColumnEnd: `gutter-${ position || "end" } ${ n === "last" ? "-1" : n }`,
			}
		},
	}, {
		values: Object.fromEntries(
			[ ...Array( 12 ) ]
				// ^ max number of gutters (i.e. 11) plus one = 12
				.map( ( _, i ) => ( i + 1 ) )
				.concat( "last" )
				.map( n => {
					return [
						[ `${ n }-start`, `${ n }-start` ],
						[ n, n.toString() ],
						[ `${ n }-end`, `${ n }-end` ],
					]
				} )
				.flat(),
		)
	} )
} )

/**
 |
 | Colors
 |
 |
 */
// function getRGBChannels ( hexColorCode: string ) {
// 	const { red, green, blue } = hexRGB( hexColorCode )
// 	return `${red}, ${green}, ${blue}`
// }

const colorsPlugin = plugin( ({ addBase }) => {
	addBase( {
		":root": {
			// Grayscale/Neutral
			"--white": "255, 255, 255",
			"--black": "0, 0, 0",

			// Brand
			"--blue-gray": "189, 207, 218",
			"--dodger-blue": "0, 119, 255",
			"--midnight-blue": "27, 49, 104",
			"--indigo": "83, 22, 156",
			"--lime-green": "0, 218, 0",
			"--umber-brown": "117, 66, 21",
			"--brown-green": "107, 106, 11",
			"--maroon-red": "133, 0, 0",
			"--red": "255, 0, 0",
			"--orange-red": "255, 59, 0",
			"--yellow": "255, 217, 0",

			// Semantic
			"--primary-color": "var( --dodger-blue )",
			"--secondary-color": "var( --midnight-blue )",
			// "--primary": "var( -- )",
			// "--secondary": "var( -- )",
		}
	} )
} )


/**
 |
 | Typography
 |
 |
 */
const typographyPlugin = plugin( ({ addBase }) => {
	addBase( {
		":root": {
			"--h1-fs": "2.25rem",
				"--h1-lh": "1",
				// "--h1-ls": "",
			"--h2-fs": "1.75rem",
				// "--h2-lh": "?",
				// "--h2-ls": "",
			"--h3-fs": "1.5rem",
				// "--h3-lh": "?",
				// "--h3-ls": "",
			"--h4-fs": "1.25rem",
				"--h4-lh": "1",
				// "--h4-ls": "",
			"--h5-fs": "1.1875rem",
				// "--h5-lh": "?",
				// "--h5-ls": "",
			"--p-fs": "1rem",
				"--p-lh": "1.3",
				// "--p-ls": "",
			"--sm-fs": "0.875rem",
				"--sm-lh": "1.3",
				// "--sm-ls": "",
			"--xs-fs": "0.75rem",
				"--xs-lh": "0.97",
				// "--xs-ls": "",
			"--2xs-fs": "0.7rem",
				// "--2xs-lh": "auto",
				// "--2xs-ls": "",
		},
		"@media screen( md )": {
			":root": {
				"--h1-fs": "3rem",
					"--h1-lh": "0.9",
					// "--h1-ls": "",
				"--h2-fs": "2rem",
					"--h2-lh": "1",
					// "--h2-ls": "",
				"--h3-fs": "1.5rem",
					"--h3-lh": "1",
					// "--h3-ls": "",
				"--h4-fs": "1.1875rem",
					"--h4-lh": "1.1",
					// "--h4-ls": "",
				// "--h5-fs": "?",
					// "--h5-lh": "?",
					// "--h5-ls": "",
				"--p-fs": "1rem",
					"--p-lh": "1.3",
					// "--p-ls": "",
				"--sm-fs": "0.8125rem",
					"--sm-lh": "1",
					// "--sm-ls": "",
				"--xs-fs": "0.75rem",
					"--xs-lh": "normal",
					// "--xs-ls": "",
				"--2xs-fs": "0.6875rem",
					"--2xs-lh": "1.3",
					// "--2xs-ls": "",
			},
		},
		"@media screen( lg )": {
			":root": {
				"--h1-fs": "4.5rem",
					"--h1-lh": "0.9",
					// "--h1-ls": "",
				"--h2-fs": "3.5rem",
					"--h2-lh": "0.97",
					// "--h2-ls": "",
				"--h3-fs": "3rem",
					"--h3-lh": "1",
					// "--h3-ls": "",
				"--h4-fs": "2.25rem",
					"--h4-lh": "1",
					// "--h4-ls": "",
				"--h5-fs": "1.875rem",
					"--h5-lh": "1.1",
					// "--h5-ls": "",
				"--p-fs": "1.5rem",
					"--p-lh": "1.3",
					// "--p-ls": "",
				"--sm-fs": "1.25rem",
					"--sm-lh": "1",
					// "--sm-ls": "",
				"--xs-fs": "1.125rem",
					"--xs-lh": "normal",
					// "--xs-ls": "",
				// "--2xs-fs": "?",
					// "--2xs-lh": "?",
					// "--2xs-ls": "",
			},
		},
	} )
} )


/**
 |
 | Transitions and Animations
 |
 |
 */
const transitionsAndAnimations = plugin( () => {}, {
	theme: {
		extend: {
			transitionDuration: {
				"250": "250ms",
				"400": "400ms",
				"450": "450ms",
				"750": "750ms",
			},
			transitionTimingFunction: {
				"ease-in-quad": "cubic-bezier( .55, .085, .68, .53 )",
				"ease-in-cubic": "cubic-bezier( .550, .055, .675, .19 )",
				"ease-in-quart": "cubic-bezier( .895, .03, .685, .22 )",
				"ease-in-quint": "cubic-bezier( .755, .05, .855, .06 )",
				"ease-in-expo": "cubic-bezier( .95, .05, .795, .035 )",
				"ease-in-circ": "cubic-bezier( .6, .04, .98, .335 )",

				"ease-out-quad": "cubic-bezier( .25, .46, .45, .94 )",
				"ease-out-cubic": "cubic-bezier( .215, .61, .355, 1 )",
				"ease-out-quart": "cubic-bezier( .165, .84, .44, 1 )",
				"ease-out-quint": "cubic-bezier( .23, 1, .32, 1 )",
				"ease-out-expo": "cubic-bezier( .19, 1, .22, 1 )",
				"ease-out-circ": "cubic-bezier( .075, .82, .165, 1 )",

				"ease-in-out-quad": "cubic-bezier( .455, .03, .515, .955 )",
				"ease-in-out-cubic": "cubic-bezier( .645, .045, .355, 1 )",
				"ease-in-out-quart": "cubic-bezier( .77, 0, .175, 1 )",
				"ease-in-out-quint": "cubic-bezier( .86, 0, .07, 1 )",
				"ease-in-out-expo": "cubic-bezier( 1, 0, 0, 1 )",
				"ease-in-out-circ": "cubic-bezier( .785, .135, .15, .86 )",

				"vaul": "cubic-bezier( 0.32, 0.72, 0, 1 )"
			}
		}
	}
} )





export default {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		screens: viewportSizesInPixels,
		fontFamily: {
			sans: [ `"HB Goblet A"`, ...defaultTheme.fontFamily.sans ],
			mono: [ `"Courier Prime"`, ...defaultTheme.fontFamily.mono ],
		},
		fontSize: {
			h1: [ "var( --h1-fs )", { lineHeight: "var( --h1-lh, normal )", letterSpacing: "var( --h1-ls, normal )" } ],
			h2: [ "var( --h2-fs )", { lineHeight: "var( --h2-lh, normal )", letterSpacing: "var( --h2-ls, normal )" } ],
			h3: [ "var( --h3-fs )", { lineHeight: "var( --h3-lh, normal )", letterSpacing: "var( --h3-ls, normal )" } ],
			h4: [ "var( --h4-fs )", { lineHeight: "var( --h4-lh, normal )", letterSpacing: "var( --h4-ls, normal )" } ],
			h5: [ "var( --h5-fs )", { lineHeight: "var( --h5-lh, normal )", letterSpacing: "var( --h5-ls, normal )" } ],
			p: [ "var( --p-fs )", { lineHeight: "var( --p-lh, normal )", letterSpacing: "var( --p-ls, normal )" } ],
			sm: [ "var( --sm-fs )", { lineHeight: "var( --sm-lh, normal )", letterSpacing: "var( --sm-ls, normal )" } ],
			xs: [ "var( --xs-fs )", { lineHeight: "var( --xs-lh, normal )", letterSpacing: "var( --xs-ls, normal )" } ],
			"2xs": [ "var( --2xs-fs )", { lineHeight: "var( --2xs-lh, normal )", letterSpacing: "var( --2xs-ls, normal )" } ],
		},
		extend: {
			spacing: spacings,
			columns: gridSpacings,
			colors: {
				// Grayscale/Neutral
				"white": "rgba( var( --white ), <alpha-value> )",
				"black": "rgba( var( --black ), <alpha-value> )",

				// Brand
				"blue-gray": "rgba( var( --blue-gray ), <alpha-value> )",
				"dodger-blue": "rgba( var( --dodger-blue ), <alpha-value> )",
				"midnight-blue": "rgba( var( --midnight-blue ), <alpha-value> )",
				"indigo": "rgba( var( --indigo ), <alpha-value> )",
				"lime-green": "rgba( var( --lime-green ), <alpha-value> )",
				"umber-brown": "rgba( var( --umber-brown ), <alpha-value> )",
				"brown-green": "rgba( var( --brown-green ), <alpha-value> )",
				"maroon-red": "rgba( var( --maroon-red ), <alpha-value> )",
				"red": "rgba( var( --red ), <alpha-value> )",
				"orange-red": "rgba( var( --orange-red ), <alpha-value> )",
				"yellow": "rgba( var( --yellow ), <alpha-value> )",

				// Semantic
				"primary": "rgba( var( --primary-color ), <alpha-value> )",
				"secondary": "rgba( var( --secondary-color ), <alpha-value> )",
			}
		},
	},
	corePlugins: {
		preflight: true,
	},
	plugins: [
		spacingPlugin,
		layoutAndContainersPlugin,
		gridPlugin,
		typographyPlugin,
		colorsPlugin,
		transitionsAndAnimations,
	],
} satisfies Config
