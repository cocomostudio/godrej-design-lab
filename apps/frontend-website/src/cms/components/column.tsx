
import { shallow_clone_props } from "../utilities/shallow-clone-props"

export class Column {
	static id = "container.column-v1"

	constructor ( __content, number, props ) {
		return {
			__component: Column.id,
			__content,
			number,
			__parent: props,
		}
	}

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ number, children, __parent }) {
		const layout = __parent.layout
		const className = column_config_to_classname[ layout ][ number ]
		return <div className={ `${ className } [&>:first-child]:mt-0 max-md:empty:hidden` }>
			{ children }
		</div>
	}
}

const column_config_to_classname = {
	"1": {
		"1": "w-full",
	},
	"1:2": {
		"1": "md:w-2c-1g lg:w-3c-2g",
		"1_empty": "md:ml-2c-2g lg:ml-3c-3g",
		"2": "md:ml-1g md:w-5c-4g lg:w-6c-5g",
	},
	"2:1": {
		"1": "md:w-5c-4g lg:w-6c-5g",
		"1_empty": "md:ml-5c-4g lg:ml-6c-5g",
		"2": "md:ml-1g md:w-2c-1g lg:w-3c-2g",
	},
	"3:4": {
		"1": "md:w-3c-2g lg:w-4c-3g",
		"1_empty": "md:ml-3c-3g lg:ml-4c-4g",
		"2": "md:ml-1g md:w-4c-3g lg:w-5c-4g",
	},
	"2:7": {
		"1": "md:w-2c-1g lg:w-2c-1g",
		"1_empty": "md:ml-2c-2g lg:ml-2c-2g",
		"2": "md:ml-1g md:w-5c-4g lg:w-7c-6g",
	},
	"7:2": {
		"1": "md:w-5c-4g lg:w-7c-6g",
		"1_empty": "md:ml-5c-5g lg:ml-7c-7g",
		"2": "md:ml-1g md:w-2c-1g lg:w-2c-1g",
	},
}
