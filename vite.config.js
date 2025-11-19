import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { resolve } from "path";

export default defineConfig({
	base: "./",
	plugins: [glsl()],
	build: {
		outDir: "dist",
		minify: "terser",
		terserOptions: {
			compress: {
				passes: 10,
			},
			mangle: true,
		},
		rollupOptions: {
			// input: {
			// 	main: resolve(__dirname, "src/main.js"),
			// },
			output: {
				entryFileNames: "main.js",
				chunkFileNames: "[name].js",
				assetFileNames: "[name].[ext]",
				format: "esm",
				manualChunks(id) {
					if (id.includes("node_modules")) {
						if (id.includes("gsap") || id.includes("lenis")) {
							return "vendor-animation";
						}

						if (
							id.includes("@rive-app/webgl2") ||
							id.includes("three")
						) {
							return "vendor-rive-3d";
						}

						return "vendor";
					}

					if (id.includes("src/animations")) {
						return "app-animations";
					}
				},
			},
		},
		reportCompressedSize: true,
	},
	server: {
		port: 5173,
		host: true,
		cors: true,
		hmr: {
			protocol: "ws",
			host: "localhost",
			port: 5173,
		},
		watch: {
			usePolling: true,
		},
		allowedHosts: ["dev.indrampd.web.id"],
	},
	preview: {
		port: 4173,
		cors: true,
	},
});
