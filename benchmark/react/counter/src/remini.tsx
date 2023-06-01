import { box, update } from "remini";
export { version } from "../../../node_modules/remini/package.json";
import { useBox } from "remini/react";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

export const $counter = box(0);

export const increment = () => {
	update($counter, (count) => count + 1);
};

function App() {
	const count = useBox($counter);

	return <h1 onClick={clickAction(increment)}>{count}</h1>;
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
