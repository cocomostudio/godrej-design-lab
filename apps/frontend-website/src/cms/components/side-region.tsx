
/**
 |
 | Side region
 |
 |
 */

import { Level } from "react-accessible-headings"

import { shallow_clone_props } from "../utilities/shallow-clone-props"

export class SideRegion {
	static id = "container.side-region-v1"

	constructor ( child_nodes, toc, navigable_content ) {
		let toc_content = [ ]
		if ( toc ) {
			for ( const node of navigable_content ) {
				if ( ! node.__component.includes( "container.section" ) ) {
					continue
				}
				if ( ! node.register_with_toc ) {
					continue
				}
				if ( !node.title || node.title.trim() === "" ) {
					continue
				}
				toc_content = toc_content.concat( {
					label: node.title,
					slug: node.title.replace( /\s+/g, "-" ).toLowerCase(),
				} )
			}
		}

		return {
			__component: SideRegion.id,
			__content: Array.isArray( child_nodes?.content ) ? [ ...child_nodes.content ] : [ ],
			toc,
			toc_content,
		}
	}

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ toc, toc_content, children }) {
		return <div className="side-region empty:hidden md:absolute top-0 left-0 md:w-1c lg:w-2c-1g h-full | _[&>:last-child]:mt-0">
			<Level>
				{ toc && <TableOfContents toc_content={ toc_content } className="max-md:hidden md:sticky top-8 left-0" /> }
				<aside className="empty:hidden max-md:mt-6 [&>:first-child]:mt-0">
					{ children }
				</aside>
			</Level>
		</div>
	}
}

function TableOfContents ( { toc_content, className = null }: React.ComponentProps<"nav"> ) {
	return <nav className={ `${ className } md:w-1c lg:w-2c-1g -mt-8 py-8 bg-white` }>
		<ol className="text-xs text-secondary border-t border-primary">
			{ toc_content.map( ( { label, slug }, i ) => <li key={ i } className="py-3 border-b border-primary">
				<a className="block" href={ "#" + slug }>{ label }</a>
			</li> ) }
		</ol>
	</nav>
}
