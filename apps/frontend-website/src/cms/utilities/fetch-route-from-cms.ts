
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
						"media.gallery-1-image-row-v1": populate_all,
						"media.gallery-2-image-row-v1": populate_all,
						"media.gallery-3-image-row-v1": populate_all,
					}
				}
			}
		},
		"text.wysiwyg-v1": populate_all,
		"text.heading-v1": populate_all,
		"text.unordered-list-v1": populate_all,
		"navigation.button-link-v1": populate_all,
		"navigation.image-link-v1": {
			populate: [
				"link",
				"image.file"
			]
		},
	}
	const populate_v1_section = {
		populate: {
			heading: "*",
			content: {
				on: {
					"container.columns-1-v1": {
						populate: {
							column: {
								populate: {
									content: {
										on: populate_v1_attributes
									}
								}
							},
						}
					},
					"container.columns-2-v1": {
						populate: {
							column_1: {
								populate: {
									content: {
										on: populate_v1_attributes
									}
								}
							},
							column_2: {
								populate: {
									content: {
										on: populate_v1_attributes
									}
								}
							},
						}
					},
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
						"fellowships.fellowship-v1": {
							populate: [
								"projects",
								"projects.cover.file",
								"projects.fellows",
								"projects.link",
							]
						}
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
