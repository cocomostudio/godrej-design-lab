
/**
 |
 | PolymorphicComponentProps
 |
 |
 */

import type {
	ElementType,
	PropsWithChildren,
	ComponentPropsWithRef,
} from "react"

import type { Simplify } from "~/utilities/simplify.js"

// Define a type for the "as" prop that can be a React component or an HTML element string
type AsProp<C extends ElementType> = {
	as?: C;
}

// Create a type that extracts props from a component type but excludes "as" and common HTML attributes
type PropsToOmit<C extends ElementType, P> = keyof ( AsProp<C> & P )
// Example usage: type ToOmit = PropsToOmit<ComponentType<"label">, { id: string }>

// Define our polymorphic component props
export type PolymorphicComponentProps<
	C extends ElementType,
	Props = { }
> = Simplify<
	PropsWithChildren<Props & AsProp<C>>
		// ^ { as: ElementType, ...props: <whatever is explicitly passed to "Props" parameter of the PolymorphicComponentProps generic> }
	& Omit<ComponentPropsWithRef<C>, PropsToOmit<C, Props>>
		// ^ the props of "C" minus the one computed on the previous line
>
