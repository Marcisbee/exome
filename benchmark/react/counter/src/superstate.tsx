import { superstate } from "@superstate/core";
export { version } from "../../../node_modules/@superstate/core/package.json";
import { useSuperState } from "@superstate/react";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const count = superstate(0);

function App() {
	useSuperState(count);

	return (
		<h1 onClick={clickAction(() => count.set((prev) => prev + 1))}>
			{count.now()}
		</h1>
	);
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
