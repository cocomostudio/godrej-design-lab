
/**
 |
 | Button
 |
 |
 */

import type {
	ElementType,
} from "react"

import type { PolymorphicComponentProps } from "@this/typescript/react/polymorphic-component-props.js"

// Define the default element type for our Button
const default_element = "button"

// Define our Button component
const Button = <C extends ElementType = typeof default_element>( {
	as,
	children,
	className = "",
	...props
}: PolymorphicComponentProps<C> ) => {
	// Determine the component to render (default to "button" if not specified)
	const Component = as || default_element

	// Combine all classNames
	const combined_class_name = `inline-block rounded-md bg-secondary text-white px-3 py-3.5 md:px-3.75 md:py-2.25 lg:px-6 lg:py-3.75 text-xs lg:text-sm font-bold uppercase ${ className }`

	// Render the component with all props
	return <Component className={ combined_class_name } { ...props }>
		{ children }
	</Component>
}

// Set a displayName for better debugging
Button.displayName = "Button"

export { Button }
