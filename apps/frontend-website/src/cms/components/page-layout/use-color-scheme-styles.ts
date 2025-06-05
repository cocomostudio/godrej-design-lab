
type Params = {
	colors: `${ string } / ${ string }`
}
interface ReturnType extends React.CSSProperties {
	"--primary-color": `var( ${ string } )`;
	"--secondary-color": `var( ${ string } )`;
}
export function useColorSchemeStyles ( color_scheme: Params ): ReturnType | undefined {
	if ( ! color_scheme ) {
		return
	}

	const [ primary_color, secondary_color ] = color_scheme.colors.split( " / " )
	return {
		"--primary-color": `var( --${ primary_color } )`,
		"--secondary-color": `var( --${ secondary_color } )`,
	}
}
