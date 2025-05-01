
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"

export default defineConfig( {
	plugins: [
		tsconfigPaths(),
		reactRouter(),
	],
	server: {
		port: process.env.PORT ? Number( process.env.PORT ) : 9991,
			// By default, it will pull the value from the `--port` flag
	},
	css: {
		postcss: {
			plugins: [
				tailwindcss,
				autoprefixer
			],
		},
	},
} )
