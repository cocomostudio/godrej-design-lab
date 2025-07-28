
import {
	Outlet,
} from "react-router"

import { Favicons } from "./favicons/favicons.js"





export default function PrimaryLayout () {
	return <>
		<Favicons />
		<div className="bg-white">
			<Outlet />
		</div>
	</>
}
