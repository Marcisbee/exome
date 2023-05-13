// @ts-check
import * as colorette from "colorette";
import { basename } from "path";
import esbuild from "esbuild";

import { tachometer } from "./tachometer.mjs";

/**
 * @param {{ suite: string, entryPoints: string[], outdir: string, runPath: string, manual: boolean }} config
 */
export async function run(config) {
	const context = await esbuild.build({
		entryPoints: config.entryPoints,
		outdir: config.outdir,
		format: "esm",
		minify: true,
		bundle: true,
		// Legal comments should not be part of bundle as we compare raw size too
		legalComments: "none",
		define: {
			"process.env.NODE_ENV": '"production"',
		},
		alias: {
			react: "../node_modules/react",
			"react-dom": "../node_modules/react-dom",
		},
		platform: "browser",
		metafile: true,
	});

	const distPaths = Object.keys(context.metafile.outputs);

	/** @type {Partial<import('tachometer/src/config').Config>} */
	const tachometerConfig = {
		sampleSize: 10,
		timeout: 0,
		mode: config.manual ? "manual" : undefined,
		benchmarks: distPaths.map((path) => ({
			name: basename(path).replace(/\..*$/, ""),
			url: {
				kind: "local",
				urlPath: "/bench.html",
				queryString: `?bench=${path}&run=${config.runPath}`,
			},
			browser: {
				name: "chrome",
				headless: true,
				windowSize: { width: 800, height: 600 },
			},
			measurement: [{ mode: "callback" }],
		})),
	};

	console.log(`Running ${colorette.bold(colorette.red(config.suite))}..`);

	const results = await tachometer(tachometerConfig);

	if (config.manual) {
		return;
	}

	if (!results) {
		throw new Error("Failed to get results");
	}

	// Clear console logs
	process.stdout.write("\x1Bc");

	console.log(`Results for ${colorette.bold(colorette.red(config.suite))}\n`);

	const maxNameWidth = results.reduce(
		(acc, { result: { name: { length } } }) => (acc > length ? acc : length),
		0,
	);

	for (const { result, stats } of results.sort(
		(a, b) => a.stats.mean - b.stats.mean,
	)) {
		const { name, bytesSent } = result;
		const { mean, relativeStandardDeviation } = stats;
		const kb = (bytesSent / 1024).toFixed(2);

		const nameWithPadding = name.padEnd(maxNameWidth, ".");
		const [nameOnly, paddingOnly = ""] = nameWithPadding.split(/(\.*)$/);

		process.stdout.write(
			[
				colorette.blue(colorette.bold(nameOnly)),
				colorette.dim(paddingOnly),
				colorette.yellow(`${mean.toFixed(2)}ms/ops`),
				`±${(relativeStandardDeviation * 100).toFixed(2)}%`,
				colorette.dim(`(${kb}kb)`),
			].join(" ") + "\n",
		);
	}
}
