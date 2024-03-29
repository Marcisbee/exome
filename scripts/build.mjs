// @ts-check
import * as esbuild from "esbuild";

import { packagePlugin } from "./common.mjs";

/** @type {['cjs', 'esm']} */
const formats = ["cjs", "esm"];

for (const format of formats) {
	await esbuild
		.build({
			entryPoints: [
				// Main
				"./src/exome.ts",

				// Utilities
				"./src/ghost.ts",
				"./src/state.ts",
				"./src/subscribe.ts",
				"./src/utils.ts",
				"./src/react.ts",
				"./src/preact.ts",
				"./src/vue.ts",
				"./src/lit.ts",
				"./src/svelte.ts",
				"./src/solid.ts",
				"./src/angular.ts",
				"./src/rxjs.ts",
				"./src/devtools.ts",
			],
			bundle: true,
			outdir: "dist",
			entryNames: "[dir]/[name]",
			outExtension: {
				".js": format === "esm" ? ".mjs" : ".js",
			},
			minifyIdentifiers: true,
			minifySyntax: true,
			sourcemap: "external",
			treeShaking: true,
			target: "es2016",
			format,
			external: [
				"react",
				"preact",
				"vue",
				"lit",
				"svelte",
				"solid-js",
				"@angular/core",
				"rxjs",
				"exome",
			],
			platform: "browser",
			logLevel: "info",
			plugins: [packagePlugin],
		})
		.catch(() => process.exit(1));
}

await esbuild
	.build({
		entryPoints: ["src/jest/serializer.ts"],
		outfile: "dist/jest/serializer.js",
		platform: "node",
		format: "cjs",
		target: "node16",
		minify: true,
		logLevel: "info",
	})
	.catch(() => process.exit(1));
