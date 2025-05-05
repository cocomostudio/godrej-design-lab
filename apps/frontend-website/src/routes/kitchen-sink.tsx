
import type React from "react"

import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router"

import type { Route } from "./+types/kitchen-sink"

export default function ThisPage () {
	return <div className="container md:grid-layout">
		<div className="md:grid-layout">
			<p className="start-col-1 end-gutter-2 text-h1">here we are.</p>
		</div>
	</div>
}
