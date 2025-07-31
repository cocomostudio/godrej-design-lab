
/**
 |
 | Section
 |
 |
 */

import {
	useState
} from "react"
import { Level } from "react-accessible-headings"

import { PlusSymbol } from "~/__lib/this/ui/components/plus-symbol"
import { relocate_content_attribute } from "../utilities/relocate-content-attribute"
import { Heading } from "./heading"
import { HorizontalRule } from "~/__lib/react/horizontal-rule"
import { MinusSymbol } from "~/__lib/this/ui/components/minus-symbol"

export class Section {
	static id = "container.section-v1"

	static process_node ( props ) {
		return relocate_content_attribute( props )
	}

	static Renderer ({ register_with_toc, title, heading, collapsible, collapsed_by_default, children }) {
		const [ isOpen, setIsOpen ] = useState( ( ! collapsed_by_default ) || false )

		let attributes = { }
		if (
			register_with_toc
			&& ( title && title.trim() )
		) {
			attributes.id = title.replace( /\s+/g, "-" ).toLowerCase()
		}
		return <section className="mt-6 md:mt-8 lg:mt-10 [&>:first-child]:mt-0 flex flex-col _max-md:flex-col flex-wrap scroll-mt-4" { ...attributes } data-toc={ !! attributes.id }>
			{ heading && <>
				{ collapsible && <HeadingWithCollapseToggle heading={ heading } isOpen={ isOpen } setIsOpen={ setIsOpen } /> }
				{ ! collapsible && <Heading.Renderer style={{ marginTop: 0 }} { ...heading } /> }
			</> }
			<SectionBody is_collapsible={ collapsible } isOpen={ isOpen }>{ children }</SectionBody>
		</section>
	}
}

function HeadingWithCollapseToggle ({ heading, isOpen, setIsOpen }) {
	return <div className="flex justify-between items-center">
		<Heading.Renderer style={{ marginTop: 0 }} { ...heading } />
		<button type="button" onClick={ () => setIsOpen( v => !v ) } className="pl-4 md:pr-7 lg:pr-10 self-stretch">
			{
				isOpen
				? <MinusSymbol />
				: <PlusSymbol />
			}
		</button>
	</div>
}

type SectionBodyProps = React.ComponentProps<"div"> & {
	is_collapsible: boolean;
	isOpen: boolean;
	children: unknown;
}
function SectionBody ( { is_collapsible, isOpen, className, children, ...props }: SectionBodyProps ) {
	if ( children.length === 0 ) {
		return null
	}

	const classes_for_section_body = "md:[&>:not(.full-width)]:md:ml-2c-2g lg:[&>:not(.full-width)]:md:ml-3c-3g w-full"

	if ( ! is_collapsible ) {
		return <Level>
			<div className={ classes_for_section_body }>
				{ children }
			</div>
			<HorizontalRule shade="dark" />
		</Level>
	}

	return <Level>
		<div className={ `w-full not-interpolate:grid ${ isOpen ? "not-interpolate:grid-rows-[1fr] interpolate:h-auto" : "not-interpolate:grid-rows-[0fr] interpolate:h-0 delay-250" } interpolate:overflow-hidden not-interpolate:transition-all interpolate:transition-[height] !duration-450 !ease-vaul` } { ...props }>
			<div className={ `not-interpolate:overflow-hidden ${ isOpen ? "delay-300" : "opacity-0 pointer-events-none" } transition-opacity duration-250 | ${ classes_for_section_body }` }>
				{ children }
			</div>
		</div>
		<HorizontalRule shade="dark" />
	</Level>
}
