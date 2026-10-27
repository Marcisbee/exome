import * as esbuild from "esbuild";

const ctx = await esbuild.context({
	entryPoints: ["e2e/radi/counter.tsx"],
	tsconfig: "e2e/radi/tsconfig.json",
	outfile: "e2e/setup/www/app.js",
	bundle: true,
	format: "esm",
	platform: "browser",
});

await ctx.watch();
await ctx.serve({
	servedir: "e2e/setup/www",
	host: "127.0.0.1",
	port: 19473,
});
console.log("Radi adapter example: http://127.0.0.1:19473");
