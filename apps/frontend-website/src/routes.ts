
import type { RouteConfig } from "@react-router/dev/routes"

import {
	route,
	index,
	layout,
} from "@react-router/dev/routes"

export default [
	index( "routes/home.tsx" ),
	layout( "./layouts/primary-layout.tsx", [
		route( "fellows/rahul-bhusan", "routes/fellow-single.tsx" ),
		route( "kitchen-sink", "routes/kitchen-sink.tsx" ),
	] )
] satisfies RouteConfig
