
import type React from "react"

import type { Route } from "./+types/home"

import { Link } from "react-router"

export default function ThisPage () {
	return <>
		<div className="container grid-layout">
			<p className="mt-16 start-col-1 end-col-2 text-h1 uppercase">Godrej Design Labs</p>
		</div>
		<ul className="mt-8 container | text-h5 space-y-4">
			{ get_routes().map( ({ text, path }) => (
				<li key={ path }>
					<Link to={ path } className="hover:underline">{ text }</Link>
				</li>
			))}
		</ul>
	</>
}

function get_routes () {
	return [
		{ text: "Single Fellow", path: "/fellows/rahul-bhusan" },
		{ text: "Kitchen Sink", path: "/kitchen-sink" },
	]
}
