
import { Column } from "./column"

export class TwoColumnLayout {
	static id = "container.columns-2-v1"

	static process_node ( props ) {
		props = { ...props }

		props.__content = [
			new Column( props.column_1?.content, 1, props ),
			new Column( props.column_2.content, 2, props ),
		]

		delete props.column_1
		delete props.column_2

		return props
	}

	static Renderer ({ children }) {
		return <div className="2-column-layout mt-4 md:mt-8 lg:mt-10 [&.column:first-child]:mt-0 flex max-md:flex-col basis-full">
			{ children }
		</div>
	}
}
