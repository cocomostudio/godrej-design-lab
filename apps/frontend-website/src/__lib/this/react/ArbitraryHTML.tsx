
import { Script } from "~/__lib/react/Script"

export function ArbitraryHTML ( { tree } ) {
	return tree.map( ( node, i ) => {
		const C = component_map[ node.__component ]
		return <C key={ i } { ...node } />
	} )
}

const component_map = {
	"code.script-v1": Script,
}
