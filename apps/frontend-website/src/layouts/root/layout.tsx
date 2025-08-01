
import {
	Links,
	Meta,
	Scripts,
	ScrollRestoration,
	useMatches,
} from "react-router"

import { ArbitraryHTML } from "~/__lib/this/react/ArbitraryHTML"
import { DesignInspector } from "~/__lib/this/ui/components/design-inspector"

export function RootLayout ( { children }: { children: React.ReactNode } ) {
	const arbitrary_code = useArbitraryCodeToBeInjected()

	return <html lang="en" className="h-full scroll-smooth">
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<Meta />
			<Links />
			{ arbitrary_code?.before_head_closing && <ArbitraryHTML tree={ arbitrary_code.before_head_closing } /> }
		</head>
		<body className="h-full font-sans">
			{ arbitrary_code?.after_body_opening && <ArbitraryHTML tree={ arbitrary_code.after_body_opening } /> }
			{ children }
			<DesignInspector enabled={ false } />
			<ScrollRestoration />
			<Scripts />
			{ arbitrary_code?.before_body_closing && <ArbitraryHTML tree={ arbitrary_code.before_body_closing } /> }
		</body>
	</html>
}





function useArbitraryCodeToBeInjected () {
	for ( const match of useMatches() ) {
		if ( match.id === "cms" ) {
			return match.data?.page_context?.arbitrary_code ?? { }
		}
	}

	return { }
}
