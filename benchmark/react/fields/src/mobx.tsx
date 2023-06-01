import { action, observable } from "mobx";
export { version } from "../../../node_modules/mobx/package.json";
import { observer } from "mobx-react";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";

const appState = observable({
	fields: Array.from(Array(1000).keys()).map((i) => `Field #${i + 1}`),
	rename: action(function (value: string, index: number) {
		appState.fields[index] = value;
	}),
});

function Field({ index }: { index: number }) {
	const field = appState.fields[index];

	return (
		<div>
			Last {`<Field>`} render at: {new Date().toISOString()}
			&nbsp;
			<input
				value={field}
				onChange={(e) => appState.rename(e.target.value, index)}
			/>
		</div>
	);
}

const App = observer(() => {
	return (
		<div>
			<div>
				Last {`<App>`} render at: {new Date().toISOString()}
			</div>
			<br />
			{appState.fields.map((field, index) => (
				<Field key={index} index={index} />
			))}
			<h1>foot</h1>
		</div>
	);
});

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	await new Promise((resolve) => setTimeout(resolve, 10));

	return elementReady("h1");
}
