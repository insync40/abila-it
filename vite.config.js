import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { resolve } from "path";

export default defineConfig({
	base: "./",
	plugins: [glsl()],
	build: {
		outDir: "dist",
		minify: "terser",
		rollupOptions: {
			input: {
				main: resolve(__dirname, "src/main.js"),
			},
			output: {
				entryFileNames: "[name].js",
				chunkFileNames: "[name].js",
				assetFileNames: "[name].[ext]",
				format: "iife",
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
	},
	preview: {
		port: 4173,
		cors: true,
	},
});
