# Webflow Starter (Vite)

A lightweight starter project that combines Vite with common frontend libraries used for immersive sites (GSAP, Three.js, Lenis, imagesLoaded, GLSL support). This repository is a minimal scaffold intended for building Webflow-like interactions with modern tooling.

## Quick overview

-   Vite-powered development server and build with hot module replacement (HMR).
-   Pre-configured with GLSL shader support via `vite-plugin-glsl`.
-   Example dependencies included: `gsap`, `three`, `lenis`, `imagesloaded`.
-   Optimized build configuration with Terser minification and custom output naming.
-   Auto-opens browser on dev server start.
-   Small project structure to get started quickly.

## Prerequisites

-   Node.js (v16+ recommended)
-   npm or yarn

## Install

Open a terminal at the project root and run:

```bash
npm install
```

(or)

```bash
yarn
```

## Integrate with Webflow

Add this script to the footer before </body> on Webflow

### Development Mode

```HTML
<script type="module" src="http://localhost:5173/src/main.js"></script>
```

### Production Mode

```HTML
<!-- Production Mode - Use after build -->
<script src="https://your-cdn.com/main.js"></script>
```

## Available scripts

Taken from `package.json`.

-   Start dev server (hot reload, auto-opens browser)

```bash
npm run dev
```

-   Build production bundle

```bash
npm run build
```

-   Build in watch mode (for development)

```bash
npm run watch
```

-   Preview the production build locally

```bash
npm run preview
```

## Project structure

```
index.html            # App entry HTML
package.json          # npm scripts and dependencies
vite.config.js        # Vite configuration (with GLSL plugin pre-configured)
public/               # Static assets
src/                  # Source files
  main.js             # App entry JS (includes GSAP example animation)
  style.css           # Global styles
  animations/         # Animation utilities and configurations
  components/         # Reusable components
  utils/
    preloadImages.js  # Helper to preload images
```

Files you may want to edit first:

-   `src/main.js` — bootstraps your app and wires up libraries (includes example GSAP animation)
-   `src/style.css` — global styles
-   `vite.config.js` — already configured with `vite-plugin-glsl`, custom build outputs, and dev server settings
-   `index.html` — entry point with inline styles and basic markup

## Notes and tips

-   The project is intentionally minimal. Add tooling (ESLint, Prettier, TypeScript) as needed.
-   `vite-plugin-glsl` is already configured in `vite.config.js` — you can import `.glsl`, `.vert`, and `.frag` files directly.
-   Build output is optimized with custom naming (`[name].js` instead of hashed names) for easier Webflow integration.
-   Terser minification is enabled for production builds.
-   Dev server runs on port 5173 with HMR and auto-opens your browser.
-   Base path is set to `./` for flexible deployment options.
-   `three` is a large dependency — consider using selective imports or CDN for very small sites.
-   `lenis` is used for smooth scroll management; pair it carefully with UI triggers and GSAP timeline controls.

## Deploy

The `build` script outputs a `dist/` folder that you can deploy to any static hosting (Netlify, Vercel, Surge, GitHub Pages, S3, etc.).

Example deploy to Surge (installed globally):

```bash
npm run build
surge ./dist example.surge.sh
```

## Vite Configuration Features

The `vite.config.js` includes:

-   **GLSL Plugin**: Pre-configured for shader imports
-   **Build Optimization**: Terser minification with custom output naming
-   **Dev Server**: Port 5173 with HMR, CORS enabled, and polling-based file watching
-   **Preview Server**: Port 4173 with CORS support
-   **Base Path**: Set to `./` for flexible deployment

## Troubleshooting

-   If HMR isn't working, make sure you don't have service workers intercepting requests. The config uses polling for file watching which should work across different environments.
-   If an imported GLSL file fails to load, the `vite-plugin-glsl` is already configured in `vite.config.js`.
-   If `three` causes large bundles, analyze the build with `npm run build` (compressed size reporting is enabled) and consider using a bundle analyzer.
-   If the dev server doesn't auto-open, check your default browser settings or manually navigate to `http://localhost:5173`.

## Next steps (suggestions)

-   Add TypeScript support and types for the libraries.
-   Add simple examples demonstrating GSAP + ScrollTrigger, Three.js scene setup, and Lenis smooth scrolling.
-   Add tests, linting, and a pre-commit hook.

## License

This project does not contain a license file. Add one (for example MIT) if you plan to publish it.
