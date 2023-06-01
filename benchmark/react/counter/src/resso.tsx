import resso from "resso";
export { version } from "../../../node_modules/resso/package.json";
import * as React from "react";
import { unstable_batchedUpdates as batch } from "react-dom";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

resso.config({ batch });

const store = resso({ count: 0, text: "hello" });

function App() {
	const { count } = store;
	return <h1 onClick={clickAction(() => ++store.count)}>{count}</h1>;
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
