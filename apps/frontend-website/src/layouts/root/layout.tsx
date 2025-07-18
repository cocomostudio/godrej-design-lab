
import {
	Links,
	Meta,
	Scripts,
	ScrollRestoration,
} from "react-router"

import { DesignInspector } from "~/__lib/this/ui/components/design-inspector"

export function RootLayout ( { children }: { children: React.ReactNode } ) {
	return <html lang="en" className="scroll-smooth">
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<Meta />
			<Links />
		</head>
		<body className="font-sans">
			{ children }
			<DesignInspector enabled={ false } />
			<ScrollRestoration />
			<Scripts />
		</body>
	</html>
}
