// @ts-check
import { readFileSync } from "node:fs";
import { join } from "node:path";

/** @type {import('esbuild').Plugin} */
export const packagePlugin = {
	name: "package-json",
	setup({ onResolve, onLoad }) {
		onResolve({ filter: /\/package\.json$/ }, (args) => ({
			namespace: "package-json",
			path: join(args.resolveDir, args.path),
		}));

		onLoad({ filter: /./, namespace: "package-json" }, async (args) => {
			try {
				const { version } = JSON.parse(readFileSync(args.path, "utf-8"));

				return {
					contents: JSON.stringify({ version }),
					loader: "json",
				};
			} catch (err) {
				// err = { errors, warnings }
				return err;
			}
		});
	},
};
