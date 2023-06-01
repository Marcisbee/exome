import { atom } from "signia";
export { version } from "../../../node_modules/signia/package.json";
import { track } from "signia-react";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const counter = atom("counter", 0);

const App = track(function App() {
	return (
		<h1 onClick={clickAction(() => counter.set(counter.value + 1))}>
			{counter.value}
		</h1>
	);
});

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
