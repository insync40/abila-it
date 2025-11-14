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
				drop_console: true, // Remove console logs in production
				passes: 2, // Multiple passes for better compression
			},
			mangle: {
				safari10: true, // Support Safari 10
			},
		},
		rollupOptions: {
			input: {
				main: resolve(__dirname, "src/main.js"),
			},
			output: {
				entryFileNames: "[name].js",
				chunkFileNames: "[name].js",
				assetFileNames: "[name].[ext]",
				// format: "iife",
			},
		},
		reportCompressedSize: true,
		// Enable CSS code splitting
		cssCodeSplit: true,
		// Optimize dependencies
		commonjsOptions: {
			include: [/node_modules/],
			transformMixedEsModules: true,
		},
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
		allowedHosts: [
			"*.loca.lt",
			"abila-it.loca.lt",
			"abila-it.indrampd.web.id",
		],
	},
	preview: {
		port: 4173,
		cors: true,
	},
});
