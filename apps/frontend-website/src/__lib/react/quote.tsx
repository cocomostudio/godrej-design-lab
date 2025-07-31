
/**
 |
 | Quote
 |
 |
 */

import type {
	ComponentProps,
} from "react"





export function Quote ( {
	children,
	className = "",
}: ComponentProps<"blockquote"> ) {
	return <blockquote className={ `mt-6 md:mt-8 lg:mt-10 md:-ml-1c-1g lg:-ml-2c-2g _md:ml-1c-1g _lg:ml-1c-1g md:py-10 lg:py-20 ${ className }` }>
		<p className="text-h3 md:text-h2 lg:text-h2 font-bold text-secondary">
			{ children }
		</p>
	</blockquote>
}

// Set a displayName for better debugging
Quote.displayName = "Quote"
