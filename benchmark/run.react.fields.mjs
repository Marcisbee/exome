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
		"./react/fields/src/preact-signals.tsx",
		"./react/fields/src/signia.tsx",
		"./react/fields/src/jotai.tsx",
		"./react/fields/src/nanostores.tsx",
		"./react/fields/src/simpler-state.tsx",
	],
	outdir: "./react/fields/dist",
	runPath: "react/fields/index.mjs",
	manual: false,
});
