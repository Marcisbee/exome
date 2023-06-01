import { createStoreon } from "storeon";
export { version } from "../../../node_modules/storeon/package.json";
import { StoreContext, useStoreon } from "storeon/react";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const count = (store) => {
	store.on("@init", () => ({ count: 0 }));
	store.on("inc", ({ count }) => ({ count: count + 1 }));
};

const store = createStoreon([count]);

function App() {
	const { dispatch, count } = useStoreon("count");

	return <h1 onClick={clickAction(() => dispatch("inc"))}>{count}</h1>;
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(
		<StoreContext.Provider key={key++} value={store}>
			<App />
		</StoreContext.Provider>,
	);

	return elementReady("h1");
}
