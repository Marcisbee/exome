// @ts-check
import { run } from "./run.mjs";

await run({
	suite: "React Fields",
	entryPoints: [
		"./react/fields/src/exome.tsx",
		"./react/fields/src/redux.tsx",
		"./react/fields/src/mobx.tsx",
		"./react/fields/src/recoil.tsx",
		"./react/fields/src/redux-toolkit.tsx",
		"./react/fields/src/trashly.tsx",
		"./react/fields/src/valtio.tsx",
	],
	outdir: "./react/fields/dist",
	runPath: "react/fields/index.mjs",
	manual: false,
});
