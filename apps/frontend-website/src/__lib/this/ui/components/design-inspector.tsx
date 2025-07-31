
import {
	useEffect,
	useRef,
	useCallback
} from "react"

export function DesignInspector ( { enabled = false } ) {
	return <>
		<GridOverlay enabled={ enabled } />
	</>
}


function GridOverlay ( { enabled = false } ) {
	const ref = useRef<HTMLDivElement>( null )
	const toggle: React.DOMAttributes<Document>[ "onKeyDown" ] = useCallback( function toggle ( event: React.KeyboardEvent<Document> ) {
		const { keyAlias, keyCode } = getKeyCodeAndAlias( event )
		if ( keyAlias === "G" && ref.current ) {
			ref.current.classList.toggle( "hidden" )
		}
	}, [ ] )

	useEffect( function () {
		document.addEventListener( "keydown", toggle )
		return () => document.removeEventListener( "keydown", toggle )
	}, [ ] )

	return <div className={ `${ enabled ? "" : "hidden" } fixed top-0 inset-0 opacity-25 pointer-events-none` } id="js_grid_overlay" style={{ zIndex: 2147483647 }} ref={ ref }>
		<div className="container h-full grid grid-rows-1 grid-cols-5 md:grid-cols-8 lg:grid-cols-12 gap-x-4 lg:gap-x-5 *:bg-orange-red text-h1 font-sans text-white text-center">
			<div className="flex flex-col justify-between py-2 md:py-4"><span>1</span><span>1</span></div>
			<div className="flex flex-col justify-between py-2 md:py-4"><span>2</span><span>2</span></div>
			<div className="flex flex-col justify-between py-2 md:py-4"><span>3</span><span>3</span></div>
			<div className="flex flex-col justify-between py-2 md:py-4"><span>4</span><span>4</span></div>
			<div className="flex flex-col justify-between py-2 md:py-4"><span>5</span><span>5</span></div>
			<div className="flex flex-col justify-between py-2 md:py-4 max-md:hidden"><span>6</span><span>6</span></div>
			<div className="flex flex-col justify-between py-2 md:py-4 max-md:hidden"><span>7</span><span>7</span></div>
			<div className="flex flex-col justify-between py-2 md:py-4 max-md:hidden"><span>8</span><span>8</span></div>
			<div className="flex flex-col justify-between py-2 md:py-4 max-lg:hidden"><span>9</span><span>9</span></div>
			<div className="flex flex-col justify-between py-2 md:py-4 max-lg:hidden"><span>10</span><span>10</span></div>
			<div className="flex flex-col justify-between py-2 md:py-4 max-lg:hidden"><span>11</span><span>11</span></div>
			<div className="flex flex-col justify-between py-2 md:py-4 max-lg:hidden"><span>12</span><span>12</span></div>
		</div>
	</div>
}


function getKeyCodeAndAlias ( event: React.KeyboardEvent<Document> ) {
	return {
		keyAlias: ( event.key || String.fromCharCode( event.which ) ),
		keyCode: parseInt( event.which || event.keyCode ),
	}
}
