
/**
 |
 | The one call the website makes for page content.
 |
 | `.server.ts` so that it never reaches the browser bundle even if something
 | other than a loader comes to import it — the CMS's origin is a server-side
 | concern, and a route module's imports are only stripped while the import is
 | reachable from server-only exports alone.
 |
 */

import http from "node:http"
import https from "node:https"

import { Environment } from "../../../server/environment/index.ts"
import { resolve_content_status } from "../../../server/preview-link/index.ts"

/**
 |
 | Where a picture the CMS stores is served from.
 |
 | The browser cannot read server-side configuration, so this travels in the
 | loader's data instead — which is why the question is answered here, in the
 | one module that already knows the CMS exists and is guaranteed never to
 | reach the browser bundle.
 |
 | `CMS_PUBLIC_URL` rather than `CMS_URL`, and the distinction is the whole
 | point: `CMS_URL` is where *this process* dials the CMS, which in production
 | is a private address inside the VPC that no visitor can resolve. This value
 | ends up in an `src` attribute in someone else's browser.
 |
 */
export function media_origin () {
	return Environment.get( "CMS_PUBLIC_URL" )
}

export function fetch_route_from_cms ( slug: string, search_params: URLSearchParams ) {
	const url = prepare_url( slug )
	return make_http_request(
		url.href,
		prepare_request_payload( slug, search_params )
	)
}

/**
 |
 | **The slug is a visitor's string, so it is escaped rather than
 | interpolated.** This used to build the query by template literal, which let
 | a percent-encoded ampersand in the path smuggle extra parameters into it —
 | and one of them, `pull_query_from_body`, is the switch the CMS reads to
 | decide whether to take the query from the POST body at all. Given twice it
 | parses as an array, the equality test against `"true"` fails, the body is
 | ignored, and every other parameter the visitor appended is read as the
 | query instead. `?status=draft` among them.
 |
 | That is a way round the signature check two functions below, so it is fixed
 | here rather than left for ticket 15: a request to
 | `/a-real-page%26pull_query_from_body=false%26status=draft` reached the CMS
 | asking for unpublished content. `URLSearchParams` percent-encodes the
 | value, so the whole string is now one path that matches no entry.
 |
 */
function prepare_url ( slug: string ): URL {
	const url = new URL( "/api/webtools/router", Environment.get( "CMS_URL" ) )
	url.searchParams.set( "path", "/" + ( slug || "" ) )
	url.searchParams.set( "pull_query_from_body", "true" )
	return url
}

function prepare_request_payload ( slug: string, search_params: URLSearchParams ) {
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
		/**
		 |
		 | **Not `search_params.get( "status" )`.** That is what it was, and
		 | it is why a member of the public could read every unpublished entry
		 | on this site by appending a query parameter to a page address: this
		 | request is made by the website's own server, so whatever status the
		 | visitor asked for arrived at the CMS with the website's authority
		 | behind it.
		 |
		 | `resolve_content_status` grants `draft` only against a signature
		 | the CMS minted for this exact path, and answers `published` to
		 | everything else. See `server/preview-link/index.ts`.
		 |
		 */
		status: resolve_content_status( slug, search_params )
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
	const cms_host_name = Environment.get( "CMS_HOST_NAME" )
	if ( cms_host_name ) headers[ "Host" ] = cms_host_name

	return {
		method: "POST",
		headers,
			// Over TLS the certificate is matched against the SNI name, not the
			// address we dialled, so that has to be overridden alongside `Host`.
		...( is_secure && cms_host_name ? { servername: cms_host_name } : {} )
	}
}
