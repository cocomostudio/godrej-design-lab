
import type { Route } from "./+types/*"

import {
	useLoaderData,
	Link,
	data,
} from "react-router"

import { render_strapi_component } from "./strapi-component-renderer"
import { fetch_route_from_cms } from "./utilities/fetch-route-from-cms"
import { isRouteErrorResponse } from "react-router"

export async function loader ( { request, params }: Route.LoaderArgs ) {
	const slug = params[ "*" ]
	const url = new URL( request.url )
	let response
	try {
		response = await fetch_route_from_cms( slug, url.searchParams )
		if ( response.error ) {
			if ( response.error.status === 404 ) {
				throw data( { slug }, 404 )
			}
			else {
				throw data( response.error, response.error.status ?? 500 )
			}
		}
	}
	catch ( e ) {
		if ( ! ( e instanceof Error ) ) {
			console.error( { e } )
			throw e
		}
		else {
			throw data( e, 500 )
		}
	}

	if ( response?.data ) {
		response.data.__component = "container.page-layout-v1"
	}

	return response?.data
}

export default function ThisPage () {
	const data = useLoaderData()
	return render_strapi_component( data )
}

export function ErrorBoundary ( { error }: Route.ErrorBoundaryProps ) {
	let heading: string
	let message: string
	let details: string
	let stack: string | undefined

	if ( isRouteErrorResponse( error ) ) {
		if ( error.status === 404 ) {
			heading = `<span class="text-primary">Page</span><br/><span class="text-secondary">not found</span>`
		}
		message = error.status === 404
			? "The requested page could not be found."
			: "Something went wrong. Please come back later."
	}
	else if (
		import.meta.env.DEV
		&& error
		&& error instanceof Error
	) {
		heading = `<span class="text-primary">There was</span><br/><span class="text-secondary">an issue</span>`
		details = error.message
		stack = error.stack
	}

	console.error( { error } )

	return <main className="container">
		<div className="mt-8 md:ml-1c-1g lg:ml-2c-2g md:w-7c-6g lg:w-10c-9g">
			<h2 className="text-h1 font-sans font-bold uppercase" dangerouslySetInnerHTML={{ __html: heading }}></h2>
			<h3 className="mt-4 md:mt-8 lg:mt-10 text-h3">{ message }</h3>
			{ details && <p className="mt-2 text-p">{ details }</p> }
			<Link className="mt-6 md:mt-8 lg:mt-10 inline-block rounded-md bg-secondary text-primary px-3 py-3.5 md:px-3.75 md:py-2.25 lg:px-6 lg:py-3.75 text-xs lg:text-sm uppercase" to="/">Go back</Link>
			{ stack && <>
				<pre className="mt-2 w-full p-4 overflow-x-auto">
					<code>{ stack }</code>
				</pre>
			</> }
		</div>
	</main>
}
