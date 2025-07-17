
import {
	Outlet,
} from "react-router"





export default function PrimaryLayout () {
	return <div className="bg-white" style={{ "--primary-color": "var( --yellow )", "--secondary-color": "var( --umber-brown )" }}>
		<Outlet />
	</div>
}
