
type RGBString = `${ number }, ${ number }, ${ number }`
type Params = {
	primary_color_rgb: RGBString;
	secondary_color_rgb: RGBString;
}
interface ReturnType extends React.CSSProperties {
	"--primary-color": RGBString;
	"--secondary-color": RGBString;
}
export function useColorSchemeStyles ( color_scheme: Params ): ReturnType | undefined {
	if ( ! color_scheme ) {
		return
	}

	return {
		"--primary-color": color_scheme.primary_color_rgb,
		"--secondary-color": color_scheme.secondary_color_rgb,
	}
}
