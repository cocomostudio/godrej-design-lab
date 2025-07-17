
import godrej_ico from "./godrej.ico"
import godrej_57x57_png from "./godrej-57x57.png"
import godrej_72x72_png from "./godrej-72x72.png"
import godrej_76x76_png from "./godrej-76x76.png"
import godrej_114x114_png from "./godrej-114x114.png"
import godrej_120x120_png from "./godrej-120x120.png"
import godrej_144x144_png from "./godrej-144x144.png"
import godrej_152x152_png from "./godrej-152x152.png"
import godrej_167x167_png from "./godrej-167x167.png"
import godrej_180x180_png from "./godrej-180x180.png"

export function Favicons () {
	return <>
		<link rel="icon" href={ godrej_ico } type="image/x-icon" />
		<link rel="apple-touch-icon" sizes="57x57" href={ godrej_57x57_png } />
		<link rel="apple-touch-icon" sizes="72x72" href={ godrej_72x72_png } />
		<link rel="apple-touch-icon" sizes="76x76" href={ godrej_76x76_png } />
		<link rel="apple-touch-icon" sizes="114x114" href={ godrej_114x114_png } />
		<link rel="apple-touch-icon" sizes="120x120" href={ godrej_120x120_png } />
		<link rel="apple-touch-icon" sizes="144x144" href={ godrej_144x144_png } />
		<link rel="apple-touch-icon" sizes="152x152" href={ godrej_152x152_png } />
		<link rel="apple-touch-icon" sizes="167x167" href={ godrej_167x167_png } />
		<link rel="apple-touch-icon" sizes="180x180" href={ godrej_180x180_png } />
	</>
}
