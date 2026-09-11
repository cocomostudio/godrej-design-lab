
/**
 |
 | Line breaks
 |
 |
 */

import { Fragment } from "react"

import { NEW_LINES_REGEX } from "~/__lib/strings/regular-expressions"

/**
 * Renders text with its new lines preserved as `<br />` elements. HTML
 * 		collapses new lines into a single space, which is why they have to be
 * 		turned into elements in order to survive.
 *
 * React escapes the text itself, so nothing that the CMS sends over can be
 * 		interpreted as markup.
 */
export function with_line_breaks ( text: string | null | undefined ) {
	if ( ! text ) {
		return null
	}

	return text.split( NEW_LINES_REGEX ).map( ( line, i ) => <Fragment key={ i }>
		{ i > 0 && <br /> }
		{ line }
	</Fragment> )
}
