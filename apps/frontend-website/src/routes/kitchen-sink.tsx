
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
	return <section className="container flex flex-wrap max-md:flex-col">
		{/* <div className="md:w-2c-1g lg:w-3c-2g">
			First column content goes here...
		</div> */}
		<div className="md:ml-2c-2g md:w-6c-5g lg:w-9c-8g bg-rose-400">
			<div>
				Second column content goes here...
				... and can have its own children that are styled based on the global grid
			</div>
			<div className="flex max-md:flex-col md:gap-1g">
				<div className="md:w-2c-1g lg:w-3c-2g bg-blue-400">
					Nested first column content goes here...
				</div>
				<div className="md:w-2c-1g lg:w-3c-2g bg-pink-400">
					Nested second column content goes here...
				</div>
				<div className="md:ml-1c-1g md:w-1c lg:w-2c-1g bg-green-400">
					Nested third column content goes here...
				</div>
			</div>
		</div>
	</section>
}
