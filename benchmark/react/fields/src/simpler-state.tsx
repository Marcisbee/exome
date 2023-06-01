import { entity, Entity } from "simpler-state";
export { version } from "../../../node_modules/simpler-state/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";

const fieldsStore = entity(
	Array.from(Array(1000).keys()).map((i) => entity(`Field #${i + 1}`)),
);

function Field({ field: fieldStore }: { field: Entity<string> }) {
	const field = fieldStore.use();

	return (
		<div>
			Last {`<Field>`} render at: {new Date().toISOString()}
			&nbsp;
			<input value={field} onChange={(e) => fieldStore.set(e.target.value)} />
		</div>
	);
}

function App() {
	const fields = fieldsStore.use();

	return (
		<div>
			<div>
				Last {`<App>`} render at: {new Date().toISOString()}
			</div>
			<br />
			{fields.map((field, index) => (
				<Field key={index} field={field} />
			))}
			<h1>foot</h1>
		</div>
	);
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	await new Promise((resolve) => setTimeout(resolve, 10));

	return elementReady("h1");
}
