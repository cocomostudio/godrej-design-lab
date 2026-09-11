
import http from "node:http"
import https from "node:https"

import { CMS_PUBLIC_DIR_URL, CMS_HOST_NAME } from "env"

export function fetch_route_from_cms ( slug: string, search_params: URLSearchParams ) {
	const url = prepare_url( slug )
	return make_http_request(
		url.href,
		prepare_request_payload( search_params )
	)
}

function prepare_url ( slug: string ): URL {
	const path = "/" + ( slug || "" )
	const api_path = `/api/webtools/router?path=${ path }&pull_query_from_body=true`
	return new URL( api_path, CMS_PUBLIC_DIR_URL )
}

function prepare_request_payload ( search_params: URLSearchParams ) {
	const populate_all = { populate: "*" }
	const populate_v1_attributes = {
		"text.plain-string-v1": populate_all,
		"media.image-v1": populate_all,
		"media.gallery-v1": {
			populate: {
				content: {
					on: {
						"media.gallery-1-image-set-v1": populate_all,
						"media.gallery-2-image-set-v1": populate_all,
						"media.gallery-3-image-set-v1": populate_all,
					}
				}
			}
		},
		"text.wysiwyg-v1": populate_all,
		"text.heading-v1": populate_all,
		"navigation.button-link-v1": populate_all,
		"navigation.image-link-v1": {
			populate: [
				"link",
				"image.file"
			]
		},

		"gdl.promo-v1": {
			populate: [
				"link",
				"image"
			]
		},
		"gdl.heading-and-content-list-v1": populate_all,
		"gdl.image-and-content-list-v1": {
			populate: {
				content: {
					populate: [
						"image.file"
					]
				}
			}
		},
		"gdl.image-and-content-v1": {
			populate: [
				"image.file"
			]
		},
		"gdl.post-listing-v1": {
			populate: {
				content: {
					populate: [
						"image"
					]
				}
			}
		},
		"gdl.fellowship-v1": {
			populate: [
				"projects",
				"projects.cover.file",
				"projects.fellows",
				"projects.link",
			]
		}
	}
	const populate_v1_section = {
		populate: {
			heading: populate_all,
			content: {
				on: {
					...populate_v1_attributes
				}
			}
		}
	}
	let populate = {
		page_context: {
			populate: {
				cover: populate_all,
				navigation: populate_all,
				featured_links: populate_all,
				arbitrary_code: {
					populate: {
						before_head_closing: populate_all,
						after_body_opening: populate_all,
						before_body_closing: populate_all
					}
				}
			}
		},
		color_scheme: {
			populate: "*"
		},
		cover: {
			populate: "*",
		},
		header_region: {
			populate: {
				content: {
					on: {
						"container.section-v1": populate_v1_section,
					}
				}
			}
		},
		side_region: {
			populate: {
				content: {
					on: {
						"container.section-v1": populate_v1_section,
					}
				}
			}
		},
		main_region: {
			populate: {
				content: {
					on: {
						"container.section-v1": populate_v1_section,
					}
				}
			}
		}
	}

	return {
		populate,
		status: search_params.get( "status" ) || "published"
	}
}

// NOTE: This deliberately uses `node:http`/`node:https` rather than `fetch`.
// `Host` is a forbidden header name, so `fetch` silently discards it, and the
// CMS sits behind a virtual host that needs it to route the request correctly.
function make_http_request ( url: string, payload: unknown ): Promise<any> {
	const is_secure = new URL( url ).protocol === "https:"
	const transport = is_secure ? https : http
	const body = JSON.stringify( payload )

	return new Promise( ( resolve, reject ) => {
		const request = transport.request(
			url,
			prepare_request_options( body, is_secure ),
			response => {
				response.setEncoding( "utf8" )
				let text = ""
				response.on( "data", chunk => text += chunk )
				response.on( "end", () => {
					try {
						resolve( JSON.parse( text ) )
					}
					catch {
						reject( new Error(
							`The CMS responded with ${ response.statusCode } and a body that is not JSON: ${ text.slice( 0, 200 ) }`
						) )
					}
				} )
			}
		)
		request.on( "error", reject )
		request.end( body )
	} )
}

function prepare_request_options ( body: string, is_secure: boolean ) {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"Content-Length": String( Buffer.byteLength( body ) )
	}
	if ( CMS_HOST_NAME ) headers[ "Host" ] = CMS_HOST_NAME

	return {
		method: "POST",
		headers,
			// Over TLS the certificate is matched against the SNI name, not the
			// address we dialled, so that has to be overridden alongside `Host`.
		...( is_secure && CMS_HOST_NAME ? { servername: CMS_HOST_NAME } : {} )
	}
}
