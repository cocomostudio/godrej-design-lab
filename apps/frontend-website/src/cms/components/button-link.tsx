
/**
 |
 | Button Link
 |
 |
 */

import { Link } from "react-router"

import { shallow_clone_props } from "../utilities/shallow-clone-props"

export class ButtonLink {
	static id = "navigation.button-link-v1"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ( { link, target, className }: { link: unknown, target?: Parameters<typeof Link>[ 0 ][ "target" ], className?: string } ) {
		const classes = "[p+&]:mt-2"
		let props = { }
		if ( target ) {
			props.target = target
		}
		else if ( ! link.url.startsWith( "/" ) ) {
			props.target = "_blank"
		}

		return <Link to={ link.url } className={ `${ classes } inline-block rounded-md bg-secondary text-primary px-3 py-3.5 md:px-3.75 md:py-2.25 lg:px-6 lg:py-3.75 text-xs lg:text-sm uppercase ${ className }` } { ...props }>
			{ link.label }
		</Link>
	}
}
