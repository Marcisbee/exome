import * as esbuild from "esbuild";

for (const format of ["cjs", "esm"]) {
	await esbuild
		.build({
			entryPoints: [
				// Main
				"./src/exome.ts",

				// Utilities
				"./src/ghost.ts",
				"./src/state.ts",
				"./src/subscribe.ts",
				"./src/react.ts",
				"./src/preact.ts",
				"./src/vue.ts",
				"./src/lit.ts",
				"./src/svelte.ts",
				"./src/solid.ts",
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
				"rxjs",
				"exome",
			],
			platform: "browser",
			logLevel: "info",
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
