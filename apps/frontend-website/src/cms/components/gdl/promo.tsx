
/**
 |
 | Promo
 |
 |
 */

import { BlocksRenderer } from "@strapi/blocks-react-renderer"
import { shallow_clone_props } from "../../utilities/shallow-clone-props"
import { WYSIWYG } from "../wysiwyg"
import { ButtonLink } from "../button-link"
import { Image } from "../image"

export class Promo {
	static id = "gdl.promo-v1"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ heading, image, link, content }) {
		return <div className="full-width relative mt-6 md:mt-8 lg:mt-10 md:w-7c-6g lg:w-9c-8g p-6 md:px-0 md:py-50 rounded-xl overflow-hidden">
			<Image.Renderer file={ image } className="decorative absolute inset-0 !m-0 [&_img]:size-full" />
			<div className="absolute inset-0 mix-blend-multiply" style={{ backgroundImage: `linear-gradient( 186deg, #FFFFFF -3.12%, #6A6A67 88.6% )` }} aria-hidden={ true } />
			<div className="relative flex flex-col _justify-center md:flex-row md:items-center md:ml-1c-1g md:w-5c-4g lg:w-7c-6g">
				<CoerceToHeading heading={ heading } className="md:w-3c-2g lg:w-4c-3g" />
				<div className="mt-33 md:mt-0 md:ml-1g _lg:ml-2c-1g md:w-2c-1g lg:w-3c-2g">
					<div className="[&>:first-child]:mt-0 text-white">
						<WYSIWYG.Renderer content={ content } />
					</div>
					<ButtonLink.Renderer link={ link } className="mt-4" />
				</div>
			</div>
		</div>
	}
}


function CoerceToHeading ( { heading: content, className } ) {
	return <div className={ className }>
		<BlocksRenderer
			content={ content }
			blocks={{
				heading: ({ children }) => <Heading>{ children }</Heading>,
				paragraph: ({ children }) => <Heading>{ children }</Heading>,
				link: ({ children }) => <Heading>{ children }</Heading>,
				code: ({ children }) => <Heading>{ children }</Heading>,
				image: () => null,
				list: () => null,
			}}
			modifiers={{
				bold: ({ children }) => <strong className="font-bold">{ children }</strong>,
				italic: ({ children }) => <em className="italic">{ children }</em>,
			}}
		/>
	</div>
}

function Heading ({ children }) {
	return <h2 className="text-h3 md:text-h2 uppercase text-white">
		{ children }
	</h2>
}
