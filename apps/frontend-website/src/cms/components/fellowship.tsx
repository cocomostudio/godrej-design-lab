
/**
 |
 | Fellowship
 |
 |
 */

import { Link } from "react-router"

import { shallow_clone_props } from "../utilities/shallow-clone-props"
import { CMS_PUBLIC_DIR_URL } from "env"

export class Fellowship {
	static id = "gdl.fellowship-v1"

	static process_node ( props ) {
		return shallow_clone_props( props )
	}

	static Renderer ({ description, projects }) {
		return <div className="full-width fellowship-programme mt-4 [.fellowship-programme:first-child]:mt-0">
			{/* <p className="mt-3.5 text-p text-black">{ description }</p> */}
			{/* <hr className="mt-4 border-black" /> */}

			{ projects.map( ( { description, cover, fellows, link }, i ) => <div key={ i } className="fellowship-project mt-3.5 md:mt-4 flex flex-wrap md:border-b border-black md:last:border-none md:pb-4">
				<figure className="w-2c-1g md:w-1c lg:w-1c-2g h-full rounded-md overflow-hidden">
					<img src={ CMS_PUBLIC_DIR_URL + cover.file.url } className="aspect-square object-cover" />
				</figure>
				<div className="md:order-1 ml-1g w-3c-2g md:w-2c-1g lg:ml-2g lg:w-2c-4g">
					<p className="text-p max-md:font-bold text-black">{ description }</p>
					{ link && <Link to={ link.url } className="mt-4 inline-block font-mono text-p uppercase underline">Read more</Link> }
				</div>
				<ul className="md:ml-1g md:w-4c-3g lg:ml-2g lg:w-5c-4g">
					{ fellows.map( ( { name, description }, i ) => <li key={ i } className="mt-3.5 md:mt-4 md:first:mt-0 flex gap-1g pb-3.5 md:pb-3 md:last:pb-0 [.fellowship-project:last-child_&:last-child]:pb-0 border-b [.fellowship-project:last-child_&:last-child]:border-none border-black/30 last:border-black md:last:border-none">
						<p className="w-2c-1g text-p font-bold">{ name }</p>
						<p className="w-3c-2g text-p">{ description }</p>
					</li> ) }
				</ul>
			</div> ) }
		</div>
	}
}
