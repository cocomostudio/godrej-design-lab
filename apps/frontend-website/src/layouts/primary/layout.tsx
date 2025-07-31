
import {
	Link,
	Outlet,
} from "react-router"

import { GDLLogo } from "~/__lib/this/ui/components/gdl-logo.js"

import { Favicons } from "./favicons/favicons.js"
import { PageScrollProgressIndicator } from "~/__lib/this/react/PageScrollProgressIndicator.js"





export default function PrimaryLayout () {
	return <>
		<Favicons />
		<div className="bg-white duration-450 ease-vaul translate-y-[--nav-header-height]" id="primary-layout">
			<Outlet />
		</div>

		<LogoThatSticksToTheTop />

		<PageScrollProgressIndicator />
	</>
}

function LogoThatSticksToTheTop () {
	return <div className="max-md:hidden fixed top-0 left-0 w-full pt-8 pointer-events-none">
		<div className="container">
			<Link to={ "/" } className="inline-block pointer-events-auto">
				<GDLLogo className="w-1c md:w-[calc(3*(var(--column-width)/4))] h-auto fill-black [[data-nav-open=true]_&]:fill-secondary transition-colors duration-450 ease-in" />
			</Link>
		</div>
	</div>
}
