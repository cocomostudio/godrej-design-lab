
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
					lg: 1080,
					md: 720,
					sm: 480,
					xs: 360,
					xxs: 120,
				},
			}
		}
	}
}
