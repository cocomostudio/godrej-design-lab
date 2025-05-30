
/**
 |
 | Quote Component
 |
 |
 */
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';


import { shallow_clone_props } from "../utilities/shallow-clone-props";

export class Quote {

	static id = "text.quote-v1";

	static process_node(props) {
		return shallow_clone_props(props);
	}

	static Renderer(props) {
		console.log(props.content);
		return (
			<blockquote className="md:ml-1c-1g md:w-6c-5g lg:w-8c-7g flex items-center h-[660px]">
				<p className="text-h1 font-bold md:leading-[1.1] text-red">
					<BlocksRenderer
						content={props.content}
						blocks={{
							paragraph: ({ children }) => <>{children} </>,
							heading: ({ children }) => <>{children}</>,
							link: ({ children, url }) => <a href={url}>{children} </a>,
							quote: ({ children }) => <>{children} </>,
							code: ({ children }) => <>{children} </>,
							image: () => null, // skip image rendering inside text

							// Render lists inline with no bullets/numbers and no extra spans
							list: ({ children }) => <>{children}</>,

							// Render list items directly (no <li>)
							"list-item": ({ children }) => <>{children} </>
						}}
						modifiers={{
							bold: ({ children }) => <strong>{children}</strong>,
							italic: ({ children }) => <span className="italic">{children}</span>,
						}}
					/>
				</p>
			</blockquote>
		);
	}
}