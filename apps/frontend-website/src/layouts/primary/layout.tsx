
import {
	Outlet,
} from "react-router"

import { Favicons } from "./favicons/favicons.js"





export default function PrimaryLayout () {
	return <>
		<Favicons />
		<div className="bg-white" style={{ "--primary-color": "var( --yellow )", "--secondary-color": "var( --umber-brown )" }}>
			<Outlet />
		</div>
	</>
}
