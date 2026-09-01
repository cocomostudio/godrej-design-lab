
/**
 |
 | Side region
 |
 |
 */

import {
	useState,
	useEffect,
} from "react"
import { useLocation } from "react-router"
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
		return <div className="side-region empty:hidden md:absolute top-0 left-0 md:w-[calc(theme(spacing.1c)-theme(spacing.1g))] lg:w-[calc(theme(spacing.2c-1g)-theme(spacing.1g))] h-full | _[&>:last-child]:mt-0">
			<Level>
				{ toc && <TableOfContents toc_content={ toc_content } className="max-md:hidden md:sticky md:top-48 lg:top-68 left-0 translate-y-0 z-10 transition-transform ease-vaul duration-750" /> }
				<aside className="empty:hidden max-md:!mt-6 [&>:first-child]:mt-0 | [&>section:last-child_hr]:hidden" style={{ marginTop: `${ 2 + ( toc_content.length * 3 ) }rem` }}>
					{ children }
				</aside>
			</Level>
		</div>
	}
}

function TableOfContents ( { toc_content, className = null }: React.ComponentProps<"nav"> ) {
	const current_section_id = useCurrentSectionId()

	return <nav className={ `${ className } pb-8 bg-white` } id="toc">
		<ol className="text-xs text-secondary border-t border-primary empty:hidden">
			{ toc_content.map( ( { label, slug }, i ) => <li key={ i } className="py-3 border-b border-primary">
				<a className={ `block ${ current_section_id === slug ? "font-bold" : "" }` } href={ "#" + slug }>{ label }</a>
			</li> ) }
		</ol>
	</nav>
}

function useCurrentSectionId () {
	const [ current_section_id, set_current_section_id ] = useState( null )
	const { pathname } = useLocation()

	useEffect( function () {
		set_current_section_id( null )
			// ^ Reset current section when location changes

		let section_dom_nodes = document.querySelectorAll( `section[ data-toc = "true" ]` )

		if ( section_dom_nodes.length === 0 ) {
			return
		}

		let sections_hashmap = { }
		let sections_list = [ ]
		for ( const section_dom_node of section_dom_nodes ) {
			sections_list = sections_list.concat( {
				id: section_dom_node.id,
				visible: false,
				intersection_ratio: 0,
			} )
			sections_hashmap[ section_dom_node.id ] = sections_list[ sections_list.length - 1 ]
		}
		let last_scroll_y = window.scrollY

		const observer = new IntersectionObserver( ( entries ) => {
			const current_scroll_y = window.scrollY
			const is_scrolling_down = current_scroll_y > last_scroll_y

			for ( const [ index, entry ] of entries.entries() ) {
				const section_id = entry.target.id
				if ( sections_hashmap[ section_id ] ) {
					sections_hashmap[ section_id ].visible = entry.isIntersecting
					sections_hashmap[ section_id ].intersection_ratio = entry.intersectionRatio
				}
			}

			last_scroll_y = current_scroll_y

			const candidate_sections = sections_list.filter( section => section.visible )
			if ( candidate_sections.length > 2 ) {
				set_current_section_id(
					is_scrolling_down
					? candidate_sections[ candidate_sections.length - 1 - 1 ].id
						// ^ second-last
					: (
						candidate_sections[ 0 ].intersection_ratio > 0.9
						? candidate_sections[ 0 ].id
							// ^ first
						: candidate_sections[ 1 ].id
							// ^ second
					)
				)
			}
			else if ( candidate_sections.length > 1 ) {
				set_current_section_id(
					candidate_sections[ 1 ].intersection_ratio > candidate_sections[ 0 ].intersection_ratio
					? candidate_sections[ 1 ].id
					: candidate_sections[ 0 ].id
				)
			}
			else {
				set_current_section_id( candidate_sections[ 0 ].id )
			}
		}, {
			threshold: [ 0, 1 ],
		} )
		section_dom_nodes.forEach( ( section_dom_node ) => observer.observe( section_dom_node ) )

		return () => observer.disconnect()
	}, [ pathname ] )

	return current_section_id
}
