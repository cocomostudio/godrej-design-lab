
import {
	Link,
} from "react-router"
import {
	useState,
	useEffect,
	useRef,
    useLayoutEffect
} from "react"

import no_op from "~/__lib/functions/no-op"

import { GDLLogo } from "~/__lib/this/ui/components/gdl-logo"

const OFFSET_FOR_NAVIGATION_WHEN_CLOSED__CLASS = `-translate-y-[calc(100%+5rem)]`
	// ^ sometimes the navigation bleeds out momentarily;
	// 		the extra 5rem ensures that it doesn't


export function Header ({ navigation, featured_links }) {
	const nav_header_container_ref = useRef<HTMLDivElement>( null )
	const [ isNavOpen, setIsNavOpen ] = useState( false )

	useLayoutEffect( function () {
		document.documentElement.dataset.navOpen = isNavOpen.toString()
	}, [ isNavOpen ] )
	useToggleHeaderNav( isNavOpen, nav_header_container_ref )
	useUpdateHeaderNavContainerHeightOnWindowResize( isNavOpen, nav_header_container_ref )
	useMoveTableOfContents( isNavOpen )

	return <header className={ `relative ${ isNavOpen ? "" : "mb-16" } transition-[margin-bottom] duration-450 ease-vaul` }>
		<div className={ `absolute top-0 left-0 w-full z-10 grid ${ OFFSET_FOR_NAVIGATION_WHEN_CLOSED__CLASS }` } ref={ nav_header_container_ref }>
			<HeaderNavigation navigation={ navigation } featured_links={ featured_links } isVisible={ isNavOpen } onClose={ () => setIsNavOpen( false ) } className={ `w-full duration-450 ease-vaul` } />
		</div>
		<div className="relative container flex justify-between items-start pt-8">
			<Link to={ "/" } className={ `md:invisible transition-opacity ease-in ${ isNavOpen ? "opacity-0 pointer-events-none duration-150" : "duration-450" }` }>
				<GDLLogo className="fixed w-1c md:w-[calc(3*(var(--column-width)/4))] h-auto" />
			</Link>
			<button type="button" className={ `text-sm font-bold uppercase transition-opacity ease-in ${ isNavOpen ? "max-md:opacity-0 max-md:pointer-events-none duration-150" : "duration-450" }` } onClick={ () => setIsNavOpen( v => !v ) }>
				{ !isNavOpen && "Menu" }
				{ isNavOpen && "Close" }
			</button>
		</div>
	</header>
}

/*
 |
 | Computes and sets the Y-offset on the #primary-layout element,
 | 	in order to expand or close the navigation header.
 |
 |
 */
function useToggleHeaderNav ( isNavOpen, nav_header_container_ref ) {
	useLayoutEffect( () => {
		if ( ! isNavOpen ) {
			document.documentElement.style.setProperty( "--nav-header-height", "0px" )

			if ( ! nav_header_container_ref.current ) {
				return
			}

			nav_header_container_ref.current.classList.add( OFFSET_FOR_NAVIGATION_WHEN_CLOSED__CLASS )
			nav_header_container_ref.current.classList.remove( "-translate-y-full" )
		}
		else /* if ( isNavOpen ) */ {
			if ( ! nav_header_container_ref.current ) {
				return
			}
			const nav_header_container_height = nav_header_container_ref.current.offsetHeight
			document.documentElement.style.setProperty(
				"--nav-header-height",
				`${ nav_header_container_height }px`
			)

			nav_header_container_ref.current.classList.remove( OFFSET_FOR_NAVIGATION_WHEN_CLOSED__CLASS )
			nav_header_container_ref.current.classList.add( "-translate-y-full" )
		}
	}, [ isNavOpen ] )
}

function useUpdateHeaderNavContainerHeightOnWindowResize ( isNavOpen, nav_header_container_ref ) {
	useEffect( function () {
		const handleResize = () => {
			if (
				! isNavOpen
				|| ! nav_header_container_ref.current
			) {
				return
			}

			document.documentElement.style.setProperty(
				"--nav-header-height",
				`${ nav_header_container_ref.current.clientHeight }px`
			)
		}

		window.addEventListener( "resize", handleResize, { passive: true } )
		return () => window.removeEventListener( "resize", handleResize, { passive: true } )
	}, [ isNavOpen ] )
}

function useMoveTableOfContents ( isNavOpen ) {
	useLayoutEffect( function () {
		const toc_dom = document.getElementById( "toc" )
		if ( ! toc_dom ) {
			return
		}

		if ( isNavOpen ) {
			toc_dom.classList.remove( "translate-y-0" )
			toc_dom.classList.add( "md:-translate-y-[7.3rem]" )
			toc_dom.classList.add( "lg:-translate-y-44" )
		}
		else {
			toc_dom.classList.remove( "md:-translate-y-[7.3rem]" )
			toc_dom.classList.remove( "lg:-translate-y-44" )
			toc_dom.classList.add( "translate-y-0" )
		}
	}, [ isNavOpen ] )
}


interface HeaderNavigationProps extends React.ComponentProps<"header"> {
	navigation: Array<{ label: string, url: string }>;
	featured_links: Array<{ label: string, url: string }>;
	isVisible?: boolean;
	onClose: () => void;
}
function HeaderNavigation ( { navigation, featured_links, isVisible = false, onClose = no_op, className = "" }: HeaderNavigationProps ) {
	return <header className={ `bg-primary relative after:hidden md:after:block after:absolute after:top-0 after:right-0 after:w-1/3 after:h-full md:after:bg-secondary overflow-hidden ${ className }` }>
		<nav className="container md:grid-layout">
			<div className="md:hidden end-col-1 text-secondary">
				<div className="flex justify-between items-start pt-8">
					<Link to={ "/" } className={ `transition-opacity duration-250 ease-out ${ isVisible ? 'opacity-100 delay-300' : 'opacity-0' }` }>
						<GDLLogo className="w-1c md:w-[calc(3*(var(--column-width)/4))] h-auto fill-secondary" />
					</Link>
					<div className={ `w-full transition-opacity duration-150 ease-out ${ isVisible ? "opacity-100 delay-300" : "opacity-0" }` }>
						<div className="text-right">
							<button type="button" className="text-sm font-bold uppercase" onClick={ onClose }>Close</button>
						</div>
					</div>
				</div>
			</div>
			<div className={ `start-col-2 end-gutter-5 lg:end-col-7 text-secondary transition-opacity duration-250 ease-out ${ isVisible ? "opacity-100 delay-300" : "opacity-0" }` }>
				<ul className="mt-8 flex flex-col md:flex-row flex-wrap gap-6 pb-6 md:gap-3 lg:gap-1g md:pb-0">
					{ navigation.map( ( { label, url }, i ) => <li key={ i } className="md:w-1c-3g lg:w-2c-1g border-t border-secondary border-solid pt-6 md:pt-3"><Link to={ url } className="text-p md:text-sm font-bold uppercase">{ label }</Link></li> ) }
				</ul>
			</div>
			<div className="start-col-6 end-col-last md:ml-1g md:pl-6 lg:start-col-8 lg:ml-[calc(var(--column-width)/2)] bg-secondary text-primary z-10">
				<div className="relative py-8 bg-secondary before:absolute before:top-0 before:right-full before:w-1/2 before:h-full before:bg-secondary md:before:hidden after:absolute after:top-0 after:left-full after:w-1/2 after:h-full after:bg-secondary md:after:hidden">
					<h2 className={ `border-t border-primary border-solid md:border-none pt-4 md:pt-0 text-p font-bold uppercase transition-opacity duration-250 ease-out ${ isVisible ? "opacity-100 delay-300" : "opacity-0" }` }>Latest</h2>
					<ul className={ `mt-6 space-y-3 transition-opacity duration-250 ease-out ${ isVisible ? "opacity-100 delay-300" : "opacity-0" }` }>
						{ featured_links.map( ( { label, url }, i ) => <li key={ i } className=""><Link to={ url } className="text-sm">{ label }</Link></li> ) }
					</ul>
				</div>
			</div>
		</nav>
	</header>
}
