
import type { RouteConfig } from "@react-router/dev/routes"

import {
	route,
	index,
	layout,
} from "@react-router/dev/routes"

	// Which routes the build contains. Read straight from `process.env` rather
	// than through the server's environment module: this file is evaluated by
	// Vite at build and config time, in a process that is not the server.
const NODE_ENV = process.env.NODE_ENV

export default [
	...( NODE_ENV === "development" ? [ index( "routes/home.tsx" ) ] : [ ] ),
	layout( "./layouts/primary/layout.tsx", [
		...( NODE_ENV === "development" ? [ ] : [ index( "cms/cms-route-handler.tsx", { id: "home" } ) ] ),
		route( "*", "cms/cms-route-handler.tsx", { id: "cms" } ),
	] ),
	...(
		NODE_ENV === "development"
		? [ ]
		: [
			layout( "./layouts/static/layout.tsx", [
				route( "fellows/rahul-bhusan", "routes/fellow-single.tsx" ),
				route( "kitchen-sink", "routes/kitchen-sink.tsx" ),
				route( "about", "routes/about.tsx" ),
				route( "about-fellowship", "routes/about-fellowship.tsx" ),
				route( "home-dev", "routes/home-dev.tsx" ),
			] )
		]
	),
] satisfies RouteConfig
