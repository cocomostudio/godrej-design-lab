
import {
	Link,
} from "react-router"
import {
	useState,
	useEffect,
	useRef
} from "react"

import { GDLLogo } from "~/__lib/this/ui/components/gdl-logo"

export function Header ({ navigation, featured_links }) {
	const nav_header_container_ref = useRef<HTMLDivElement>( null )
	const [ isNavOpen, setIsNavOpen ] = useState( false )

	useToggleHeaderNav( isNavOpen, nav_header_container_ref )
	useUpdateHeaderNavContainerHeightOnWindowResize( isNavOpen, nav_header_container_ref )
	useMoveTableOfContents( isNavOpen )

	return <header className="relative">
		<div className="absolute top-0 left-0 w-full -translate-y-full z-10 grid" ref={ nav_header_container_ref }>
			<HeaderNavigation navigation={ navigation } featured_links={ featured_links } isVisible={ isNavOpen } className={ `w-full duration-450 ease-vaul` } />
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

function useToggleHeaderNav ( isNavOpen, nav_header_container_ref ) {
	useLayoutEffect( () => {
		if ( ! isNavOpen ) {
			document.getElementById( "primary-layout" )!.style.setProperty( "--nav-header-height", "0px" )
		}
		else /* if ( isNavOpen ) */ {
			if ( ! nav_header_container_ref.current ) {
				return
			}
			const nav_header_container_height = nav_header_container_ref.current.offsetHeight
			document.getElementById( "primary-layout" )!.style.setProperty(
				"--nav-header-height",
				`${ nav_header_container_height }px`
			)
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

			document.getElementById( "primary-layout" )!.style.setProperty(
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
