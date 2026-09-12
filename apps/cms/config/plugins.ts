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
							/**
							 |
							 | **Present, and null.** This replaces the local
							 | patch that used to be carried against this
							 | provider.
							 |
							 | Upstream still defaults the canned ACL to
							 | `public-read`, but as of 5.52.2 — the version
							 | this is pinned to — it only does so when the
							 | key is *absent* from `params`:
							 | `if (!('ACL' in config.params))`. That is a
							 | read of somebody else's implementation, so it
							 | is the thing to re-check first if uploads
							 | start failing after a version bump. The bucket
							 | has Object Ownership set to "bucket owner
							 | enforced", so ACLs are disabled on it and any
							 | request carrying an `x-amz-acl` header is
							 | rejected outright with
							 | `AccessControlListNotSupported`. Naming the
							 | key suppresses the default; the falsy value
							 | then keeps the header off the request, because
							 | the upload path spreads the ACL in only when
							 | it is truthy.
							 |
							 | `null` rather than `undefined`, and the
							 | distinction is load-bearing: `'ACL' in params`
							 | is what upstream tests, and any configuration
							 | round-trip that drops undefined values — a
							 | JSON serialisation, a merge helper — would
							 | take the key with it and silently restore
							 | world-readable objects. `null` survives all of
							 | them.
							 |
							 */
							ACL: null,
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
