
import {
	Outlet,
	Link,
} from "react-router"
import {
	useState,
} from "react"

import { GDLLogo } from "~/__lib/this/ui/components/gdl-logo"
import { GodrejLogo } from "~/__lib/this/ui/components/godrej-logo"





export default function StaticLayout () {
	return <div className="bg-white" style={{ "--primary-color": "var( --yellow )", "--secondary-color": "var( --umber-brown )" }}>
		<Header />
		<Outlet />
		<Footer className="mt-10 md:mt-22" />
	</div>
}





function Header () {
	const [ isNavOpen, setIsNavOpen ] = useState( false )
	return <header>
		<div className={ `relative z-10 grid ${ isNavOpen ? "not-interpolate:grid-rows-[1fr] interpolate:h-auto" : "not-interpolate:grid-rows-[0fr] interpolate:h-0" } not-interpolate:transition-all interpolate:transition-[height] not-interpolate:will-change-[grid-rows] interpolate:will-change-[height] !duration-450 !ease-vaul` }>
			<div className="overflow-hidden">
				<HeaderNavigation isVisible={ isNavOpen } className={ `w-full transition-transform duration-450 ease-vaul ${ isNavOpen ? "translate-y-0" : "-translate-y-full pointer-events-none" }` } />
			</div>
		</div>
		<div className="relative container flex justify-between items-start pt-8">
			<Link to={ "/" } className={ `transition-opacity duration-150 ease-in ${ isNavOpen ? "opacity-0 pointer-events-none" : "" }` }>
				<GDLLogo className="w-1c md:w-[calc(var(--column-width)/2)] lg:w-[calc(3*(var(--column-width)/4))] h-auto fill-secondary" />
			</Link>
			<button type="button" className="text-sm font-bold uppercase" onClick={ () => setIsNavOpen( v => !v ) }>
				{ !isNavOpen && "Menu" }
				{ isNavOpen && "Close" }
			</button>
		</div>
	</header>
}


interface HeaderNavigationProps extends React.ComponentProps<"header"> {
	isVisible?: boolean;
}
function HeaderNavigation ( { isVisible = false, className = "" }: HeaderNavigationProps ) {
	return <header className={ `bg-primary relative after:absolute after:top-0 after:right-0 after:w-1/3 after:h-full md:after:bg-secondary ${ className }` }>
		<nav className="md:container md:grid-layout">
			<div className="end-col-1 text-secondary">
				<div className="container flex justify-between items-start pt-8">
					<Link to={ "/" } className={ `transition-opacity duration-250 ease-out ${ isVisible ? 'opacity-100 delay-300' : 'opacity-0' }` }>
						<GDLLogo className="w-1c md:w-[calc(var(--column-width)/2)] lg:w-[calc(3*(var(--column-width)/4))] h-auto fill-secondary" />
					</Link>
					<div className={ `absolute top-full left-0 w-full transition-opacity duration-150 ease-out ${ isVisible ? "opacity-100 delay-300" : "opacity-0" }` }>
						<div className="container text-right">
							<button type="button" className="text-sm font-bold uppercase">Close</button>
						</div>
					</div>
				</div>
			</div>
			<div className={ `start-col-2 end-gutter-5 lg:end-col-7 text-secondary transition-opacity duration-250 ease-out ${ isVisible ? "opacity-100 delay-300" : "opacity-0" }` }>
				<ul className="mt-8 container flex flex-col md:flex-row flex-wrap gap-6 pb-6 md:gap-3 lg:gap-1g md:pb-0">
					<li className="md:w-1c-3g lg:w-2c-1g border-t border-secondary border-solid pt-6 md:pt-3"><Link to={ "#" } className="text-p md:text-sm font-bold uppercase">About</Link></li>
					<li className="md:w-1c-3g lg:w-2c-1g border-t border-secondary border-solid pt-6 md:pt-3"><Link to={ "#" } className="text-p md:text-sm font-bold uppercase">Fellowship</Link></li>
					<li className="md:w-1c-3g lg:w-2c-1g border-t border-secondary border-solid pt-6 md:pt-3"><Link to={ "#" } className="text-p md:text-sm font-bold uppercase">Conscious Collective</Link></li>
					<li className="md:w-1c-3g lg:w-2c-1g border-t border-secondary border-solid pt-6 md:pt-3"><Link to={ "#" } className="text-p md:text-sm font-bold uppercase">Reports</Link></li>
					<li className="md:w-1c-3g lg:w-2c-1g border-t border-secondary border-solid pt-6 md:pt-3"><Link to={ "#" } className="text-p md:text-sm font-bold uppercase">Design Series</Link></li>
					<li className="md:w-1c-3g lg:w-2c-1g border-t border-secondary border-solid pt-6 md:pt-3"><Link to={ "#" } className="text-p md:text-sm font-bold uppercase">Campus Connect</Link></li>
				</ul>
			</div>
			<div className="start-col-6 end-col-last md:ml-1g md:pl-6 lg:start-col-8 lg:ml-[calc(var(--column-width)/2)] bg-secondary text-primary z-10">
				<div className="container py-8 bg-secondary">
					<h2 className={ `border-t border-primary border-solid md:border-none pt-4 md:pt-0 text-p font-bold uppercase transition-opacity duration-250 ease-out ${ isVisible ? "opacity-100 delay-300" : "opacity-0" }` }>Latest</h2>
					<ul className={ `mt-6 space-y-3 transition-opacity duration-250 ease-out ${ isVisible ? "opacity-100 delay-300" : "opacity-0" }` }>
						<li className=""><Link to={ "#" } className="text-sm">Myth and lore in architecture with Bijoy Jain &amp; Studio Mumbai</Link></li>
						<li className=""><Link to={ "#" } className="text-sm">Understanding conscious living in India: Materials &amp; processes</Link></li>
					</ul>
				</div>
			</div>
		</nav>
	</header>
}


function Footer ( { className }: React.ComponentProps<"footer"> ) {
	return <footer className={ className }>
		<nav className="bg-primary relative after:absolute after:top-0 after:right-0 after:w-1/3 after:h-full md:after:bg-secondary">
			<div className="md:container md:grid-layout">
				<div className="py-6 lg:py-9 start-col-1 end-col-5 lg:end-col-7">
					<div className="md:w-2c-1g lg:w-3c-2g text-white">
						<div className="container">
							<p className="text-h3 md:text-h4 lg:text-h5"><b>Godrej Design Lab</b> is a platform that encourages and advances design-led innovation.</p>
						</div>
					</div>
					<div className="mt-10 md:mt-15.5 lg:mt-28 text-white">
						<ul className="container flex flex-col md:flex-row flex-wrap gap-4.5 md:gap-3 lg:gap-1g pb-4 md:pb-0 | text-p md:text-sm font-bold uppercase" style={{ "--md-nav-w": "calc( ( 1.5 * var( --column-width ) ) + var( --gutter-width ) )" }}>
							<li className="md:w-[--md-nav-w] lg:w-2c-3g border-t border-secondary border-solid pt-4.5 md:pt-3"><Link to={ "#" }>About</Link></li>
							<li className="md:w-[--md-nav-w] lg:w-2c-3g border-t border-secondary border-solid pt-4.5 md:pt-3"><Link to={ "#" }>Fellowship</Link></li>
							<li className="md:w-[--md-nav-w] lg:w-2c-3g border-t border-secondary border-solid pt-4.5 md:pt-3"><Link to={ "#" }>Conscious Collective</Link></li>
							<li className="md:w-[--md-nav-w] lg:w-2c-3g border-t border-secondary border-solid pt-4.5 md:pt-3"><Link to={ "#" }>Reports</Link></li>
							<li className="md:w-[--md-nav-w] lg:w-2c-3g border-t border-secondary border-solid pt-4.5 md:pt-3"><Link to={ "#" }>Design Series</Link></li>
							<li className="md:w-[--md-nav-w] lg:w-2c-3g border-t border-secondary border-solid pt-4.5 md:pt-3"><Link to={ "#" }>Campus Connect</Link></li>
						</ul>
					</div>
				</div>
				<div className="start-gutter-5 lg:start-col-8 end-col-last md:-ml-1g lg:ml-0 py-4.5 md:pl-4 md:py-6 lg:pl-12 lg:py-10 bg-secondary text-white z-10">
					<div className="container md:flex flex-col justify-between h-full bg-secondary">
						<Link to={ "/" }>
							<GodrejLogo className="md:w-1c h-auto fill-white" />
						</Link>
						<div className="mt-10">
							<p className="md:mt-auto font-mono text-2xs md:text-sm/[normal] font-bold">Copyright © Godrej Enterprises Group. All rights reserved</p>
							<ul className="mt-4 md:mt-3 flex justify-between | font-mono text-2xs md:text-sm font-bold">
								<li><Link to="#">Legal</Link></li>
								<li><Link to="#">Disclaimer</Link></li>
								<li><Link to="#">Privacy Policy</Link></li>
								<li><Link to="#">Terms &amp; Conditions</Link></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</nav>
	</footer>
}
