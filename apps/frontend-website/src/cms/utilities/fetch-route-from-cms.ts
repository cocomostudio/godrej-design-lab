
import { CMS_PUBLIC_DIR_URL } from "env"

export function fetch_route_from_cms ( slug: string ) {
	const url = prepare_url( slug )
	return make_http_request(
		url.href,
		prepare_request_payload()
	)
}

function prepare_url ( slug: string ): URL {
	const path = "/" + slug
	const api_path = `/api/webtools/router?path=${ path }&pull_query_from_body=true`
	return new URL( api_path, CMS_PUBLIC_DIR_URL )
}

function prepare_request_payload () {
	const populate_all = { populate: "*" }
	const populate_v1_attributes = {
		"miscellaneous.horizontal-rule-v1": populate_all,
		"text.plain-string-v1": populate_all,
		"text.quote-v1": populate_all,
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
			populate: "*",
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
		populate
	}
}

function make_http_request ( url: string, payload: unknown ) {
	return fetch( url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify( payload )
	} )
		.then( r => r.json() )
}
