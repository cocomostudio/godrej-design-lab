
import type React from "react"

export function PlusSymbol ( { className, ...props }: React.ComponentProps<"svg"> ) {
	return <svg xmlns="http://www.w3.org/2000/svg" width="29" height="30" viewBox="0 0 29 30" fill="none" className={ className } { ...props }>
		<path d="M14.8485 0.84668V29.1529M29.0015 14.9998L0.695312 14.9998" stroke="#000000" />
	</svg>
}
