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
	{
		name: "strapi::body",
		config: {
			formLimit: "20mb",
			jsonLimit: "20mb", 
			textLimit: "20mb",
			formidable: {
				maxFileSize: 20 * 1024 * 1024, // 20MB in bytes
			},
		},
	},
	"strapi::session",
	"strapi::favicon",
	"strapi::public",
]
