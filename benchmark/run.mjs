// @ts-check
import * as colorette from "colorette";
import { basename, resolve } from "path";
import esbuild from "esbuild";

import { tachometer } from "./tachometer.mjs";
import { writeFileSync } from "fs";

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
		outExtension: {
			".js": ".mjs",
		},
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
		benchmarks: await Promise.all(
			distPaths.map(async (path) => {
				const { version } = await import(resolve(path));

				return {
					name: [basename(path).replace(/\..*$/, ""), version]
						.filter(Boolean)
						.join("-v"),
					url: {
						kind: "local",
						urlPath: "/bench.html",
						queryString: `?bench=${path}&run=${config.runPath}`,
					},
					browser: {
						name: "chrome",
						addArguments: [
							"--no-sandbox",
							"--no-first-run",
							"--enable-automation",
							"--disable-infobars",
							"--disable-background-networking",
							"--disable-background-timer-throttling",
							"--disable-cache",
							"--disable-translate",
							"--disable-sync",
							"--disable-extensions",
							"--disable-default-apps",
							"--js-flags=--expose-gc",
							"--enable-precise-memory-info",
						],
						headless: true,
						windowSize: { width: 800, height: 600 },
					},
					measurement: [
						{
							mode: "expression",
							name: "performance",
							expression: "window.tachometerResultPerformance",
						},
						{
							mode: "expression",
							name: "startup",
							expression: "window.tachometerResultStartup",
						},
						{
							mode: "expression",
							name: "memory",
							expression: "window.tachometerResultMemory",
						},
					],
				};
			}),
		),
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

	const maxNameWidth = results.reduce((acc, { result: { name } }) => {
		const length = name.replace(/ \[[^\]]+\]$/, "").length;

		return acc > length ? acc : length;
	}, 0);

	const groupedResults = results.reduce(
		/**
		 * @param {Record<string, Record<string, import('tachometer/src/stats').ResultStatsWithDifferences>>} acc
		 * @param {import('tachometer/src/stats').ResultStatsWithDifferences} result
		 * @returns
		 */
		(acc, result) => {
			const [name, type] = result.result.name.split(/ \[([^\]]+)\]$/);

			if (!acc[name]) {
				acc[name] = {
					[type]: result,
				};
			} else {
				acc[name][type] = result;
			}

			return acc;
		},
		{},
	);

	const sortedResults = Object.entries(groupedResults).sort(
		([, a], [, b]) => a.performance.stats.mean - b.performance.stats.mean,
	);

	for (const [name, { performance, startup, memory }] of sortedResults) {
		const kb = (performance.result.bytesSent / 1024).toFixed(1);

		delete performance.differences;
		delete startup.differences;
		delete memory.differences;

		const nameWithPadding = name.padEnd(maxNameWidth, ".");
		const [nameOnly, paddingOnly = ""] = nameWithPadding.split(/(\.*)$/);

		process.stdout.write(
			[
				colorette.blue(colorette.bold(nameOnly)),
				colorette.dim(paddingOnly),
				colorette.yellow(`${performance.stats.mean.toFixed(1)} ms/ops`),
				`±${performance.stats.standardDeviation.toFixed(1)}`,
				// "|",
				// colorette.yellow(`${startup.stats.mean.toFixed(2)} ms`),
				"|",
				colorette.dim(`${kb} KB`),
				// "|",
				// colorette.dim(`${(memory.stats.mean / 1024 / 1024).toFixed(2)} MB`),
			].join(" ") + "\n",
		);
	}

	writeFileSync(
		`meta.${config.suite
			.trim()
			.replace(/[A-Z]/g, (match) => match.toLowerCase())
			.replace(/[ ]+/g, ".")}.json`,
		JSON.stringify(sortedResults, null, 2),
	);
}
