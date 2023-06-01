import { action, observable } from "mobx";
export { version } from "../../../node_modules/mobx/package.json";
import { observer } from "mobx-react";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const appState = observable({
	count: 0,
	increment: action(function () {
		appState.count += 1;
	}),
});

const App = observer(() => {
	return <h1 onClick={clickAction(appState.increment)}>{appState.count}</h1>;
});

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
