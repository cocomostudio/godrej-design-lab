export default function ({ env }) {
	return {
		upload: {
			config: {
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
				allowedTypes: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
				breakpoints: {
					xl: 1920,
					l: 1080,
					m: 720,
					sm: 360,
					xs: 96,
				},
			},
		},
	};
}
