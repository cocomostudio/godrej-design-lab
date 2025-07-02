export default ({ env }) => [
	"strapi::logger",
	"strapi::errors",
	{
		name: "strapi::security",
		config: {
			contentSecurityPolicy: {
				useDefaults: true,
				directives: {
					"connect-src": ["'self'", "https:", "http:"],
					"img-src": [
						"'self'",
						"data:",
						"blob:",
						"market-assets.strapi.io",
						"dl.airtable.com",
						`${env("AWS_BUCKET_NAME")}.s3.${env("AWS_REGION")}.amazonaws.com`,
						env("CLOUDFRONT_URL"),
					],
					"media-src": [
						"'self'",
						"data:",
						"blob:",
						"market-assets.strapi.io",
						"dl.airtable.com",
						`${env("AWS_BUCKET_NAME")}.s3.${env("AWS_REGION")}.amazonaws.com`,
						env("CLOUDFRONT_URL"),
					],
					"frame-src": ["'self'", "editor.unlayer.com"],
				},
			},
		},
	},
	"strapi::cors",
	"strapi::poweredBy",
	"strapi::query",
	"strapi::body",
	"strapi::session",
	"strapi::favicon",
	"strapi::public",
]
