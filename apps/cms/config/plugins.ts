export default function ({ env }) {
	return {
		upload: {
			config: env("IS_ON_AWS") === "true" ? {
				// AWS S3 configuration for production
				provider: "aws-s3",
				providerOptions: {
					baseUrl: env("CLOUDFRONT_URL"),
					s3Options: {
						region: env("AWS_REGION"),
						params: {
							Bucket: env("AWS_BUCKET_NAME"),
						},
					},
				},
				sizeLimit: 20 * 1024 * 1024, // 20MB in bytes
				breakpoints: {
					xl: 1920,
					lg: 1080,
					md: 720,
					sm: 480,
					xs: 360,
					xxs: 120,
				},
			} : {
				// Local file upload configuration for development
				providerOptions: {
					localServer: {
						directory: "./environment/uploads"
					}
				},
				provider: "local",
				breakpoints: {
					xl: 1920,
					lg: 1080,
					md: 720,
					sm: 480,
					xs: 360,
					xxs: 120,
				},
			},
		},
	};
}
