
/**
 |
 | Button Link
 |
 |
 */

import { Link } from "react-router"

import { shallow_clone_props } from "../utilities/shallow-clone-props"
import { Button } from "~/__lib/react/button"

export class ButtonLink {
	static id = "navigation.button-link-v1"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ( { link, target, className }: { link: unknown, target?: Parameters<typeof Link>[ 0 ][ "target" ], className?: string } ) {
		const classes = "mt-2 self-start"
		let props = { }
		if ( target ) {
			props.target = target
		}
		else if ( ! link.url.startsWith( "/" ) ) {
			props.target = "_blank"
		}

		return <Button as={ Link } to={ link.url } className={ classes } { ...props }>
			{ link.label }
		</Button>
	}
}
