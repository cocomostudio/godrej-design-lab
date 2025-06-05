
import {
	Link,
} from "react-router"
import { useState } from "react"

import { GDLLogo } from "~/__lib/this/ui/components/gdl-logo"

export function Header ({ navigation, featured_links }) {
	const [ isNavOpen, setIsNavOpen ] = useState( false )
	return <header>
		<div className={ `relative z-10 grid ${ isNavOpen ? "not-interpolate:grid-rows-[1fr] interpolate:h-auto" : "not-interpolate:grid-rows-[0fr] interpolate:h-0" } not-interpolate:transition-all interpolate:transition-[height] not-interpolate:will-change-[grid-rows] interpolate:will-change-[height] !duration-450 !ease-vaul` }>
			<div className="overflow-hidden">
				<HeaderNavigation navigation={ navigation } featured_links={ featured_links } isVisible={ isNavOpen } className={ `w-full transition-transform duration-450 ease-vaul ${ isNavOpen ? "translate-y-0" : "-translate-y-full pointer-events-none" }` } />
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
	navigation: Array<{ label: string, url: string }>;
	featured_links: Array<{ label: string, url: string }>;
	isVisible?: boolean;
}
function HeaderNavigation ( { navigation, featured_links, isVisible = false, className = "" }: HeaderNavigationProps ) {
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
					{ navigation.map( ( { label, url }, i ) => <li key={ i } className="md:w-1c-3g lg:w-2c-1g border-t border-secondary border-solid pt-6 md:pt-3"><Link to={ url } className="text-p md:text-sm font-bold uppercase">{ label }</Link></li> ) }
				</ul>
			</div>
			<div className="start-col-6 end-col-last md:ml-1g md:pl-6 lg:start-col-8 lg:ml-[calc(var(--column-width)/2)] bg-secondary text-primary z-10">
				<div className="container py-8 bg-secondary">
					<h2 className={ `border-t border-primary border-solid md:border-none pt-4 md:pt-0 text-p font-bold uppercase transition-opacity duration-250 ease-out ${ isVisible ? "opacity-100 delay-300" : "opacity-0" }` }>Latest</h2>
					<ul className={ `mt-6 space-y-3 transition-opacity duration-250 ease-out ${ isVisible ? "opacity-100 delay-300" : "opacity-0" }` }>
						{ featured_links.map( ( { label, url }, i ) => <li key={ i } className=""><Link to={ url } className="text-sm">{ label }</Link></li> ) }
					</ul>
				</div>
			</div>
		</nav>
	</header>
}
