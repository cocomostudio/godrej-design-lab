
export default function ({ env }) {
	return {
		upload: {
			config: {
				providerOptions: {
					localServer: {
						directory: "./environment/uploads"
					}
				},
				provider: "local",
				breakpoints: {
					xl: 1920,
					l: 1080,
					m: 720,
					sm: 360,
					xs: 96,
				},
			}
		}
	}
}
