
import { Column } from "./column"

export class OneColumnLayout {
	static id = "container.columns-1-v1"

	static process_node ( props ) {
		props = { ...props }

		props.__content = [
			new Column( props.column.content, 1, props ),
		]
		delete props.column

		props.layout = "1"

		return props
	}

	static Renderer ({ children }) {
		return <div>{ children }</div>
	}
}
