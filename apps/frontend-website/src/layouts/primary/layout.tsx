
import {
	Outlet,
} from "react-router"

import { Favicons } from "./favicons/favicons.js"





export default function PrimaryLayout () {
	return <>
		<Favicons />
		<div className="bg-white duration-450 ease-vaul translate-y-[--nav-header-height]" id="primary-layout">
			<Outlet />
		</div>
	</>
}
