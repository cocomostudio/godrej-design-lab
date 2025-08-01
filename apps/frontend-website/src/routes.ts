
import type { RouteConfig } from "@react-router/dev/routes"

import {
	route,
	index,
	layout,
} from "@react-router/dev/routes"

import { NODE_ENV } from "env"

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
