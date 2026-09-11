
/**
 |
 | Where a picture the CMS stores is served from.
 |
 | That origin is server-side configuration, which the browser cannot read, so
 | the loader passes it down and every block asks for it here.
 |
 | A context rather than a prop threaded through the tree, because the blocks
 | are rendered by walking a tree the CMS describes — nothing between the route
 | and a picture knows it is about to render one, and a picture can turn up at
 | any depth.
 |
 */

import {
	type ReactNode,
	createContext,
	useContext,
} from "react"

const MediaOriginContext = createContext<string>( "" )

export function MediaOrigin (
	{ children, origin }: { children: ReactNode, origin: string },
) {
	return <MediaOriginContext.Provider value={ origin }>
		{ children }
	</MediaOriginContext.Provider>
}

export function use_media_origin () {
	return useContext( MediaOriginContext )
}
