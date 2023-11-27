// @ts-check
import * as esbuild from "esbuild";

import { packagePlugin } from "./common.mjs";

const ctx = await esbuild.context({
	entryPoints: ["./playground/index.tsx"],
	bundle: true,
	outdir: "playground/www",
	format: "esm",
	platform: "browser",
	sourcemap: "inline",
	plugins: [packagePlugin],
});

await ctx.watch();

const { host, port } = await ctx.serve({
	servedir: "playground/www",
});

console.log(`http://${host}:${port}`);
