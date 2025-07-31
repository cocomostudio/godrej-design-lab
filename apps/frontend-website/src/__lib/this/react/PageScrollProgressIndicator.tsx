
import {
	useEffect,
	useRef,
} from "react"

export function PageScrollProgressIndicator () {
	const progress_ref = useRef<HTMLDivElement>( null )

	useEffect( function () {
		function get_nav_header_height () {
			return parseInt( getComputedStyle( document.documentElement ).getPropertyValue( "--nav-header-height" ), 10 )
		}

		const handle_scroll = () => {
			if ( ! progress_ref.current ) {
				return
			}

			const scrollY = window.scrollY
			const nav_header_height = get_nav_header_height()

			const scroll_percentage =
				( scrollY - nav_header_height )
				/ ( document.documentElement.scrollHeight - ( window.innerHeight + nav_header_height ) )
					// ^ nav_header_height is factored in here because it ensures that
					// 		the progress indicator only after the navigation header is scrolled past.

			progress_ref.current.style.transform = `scaleX( ${ scroll_percentage * window.innerWidth } )`
		}

		handle_scroll()

		window.addEventListener( "scroll", handle_scroll, { passive: true } )
		return () => {
			window.removeEventListener( "scroll", handle_scroll, { passive: true } )
		}
	}, [ ] )

	return <div className="fixed top-0 left-0 w-full z-20 pointer-events-none">
		<div className="w-0.25 h-1 bg-secondary origin-left transition-transform duration-[50ms] ease-in-out" ref={ progress_ref } />
	</div>
}
