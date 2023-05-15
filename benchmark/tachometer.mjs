// @ts-check
// @ts-ignore
import sourceMapSupport from "source-map-support";
sourceMapSupport.install();

import { parseFlags } from "tachometer/lib/flags.js";
import { makeConfig } from "tachometer/lib/config.js";
import { Server } from "tachometer/lib/server.js";
import { manualMode } from "tachometer/lib/manual.js";
import { makeServerPlans } from "tachometer/lib/versions.js";
import { Runner } from "tachometer/lib/runner.js";

/**
 * @param {Partial<import('tachometer/src/config').Config>} extendConfig
 */
export async function tachometer(extendConfig) {
	const opts = parseFlags(["bench.html"]);
	const config = await makeConfig(opts);

	Object.assign(config, extendConfig);

	const { plans } = await makeServerPlans(
		config.root,
		opts["npm-install-dir"],
		config.benchmarks,
	);

	const servers = new Map();
	const promises = [];
	for (const { npmInstalls, mountPoints, specs } of plans) {
		promises.push(
			(async () => {
				const server = await Server.start({
					host: opts.host,
					ports: opts.port,
					root: config.root,
					npmInstalls,
					mountPoints,
					resolveBareModules: config.resolveBareModules,
					cache: true,
				});
				for (const spec of specs) {
					servers.set(spec, server);
				}
			})(),
		);
	}

	await Promise.all(promises);
	if (config.mode === "manual") {
		await manualMode(config, servers);
	} else {
		const runner = new Runner(config, servers);

		try {
			const log = console.log;
			console.log = () => {};
			return await runner.run().then((result) => {
				console.log = log;
				return result;
			});
		} finally {
			const allServers = new Set([...servers.values()]);
			await Promise.all([...allServers].map((server) => server.close()));
		}
	}
}
