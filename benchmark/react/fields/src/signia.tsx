import { atom, Atom } from "signia";
export { version } from "../../../node_modules/signia/package.json";
import { track } from "signia-react";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";

const fields = atom(
	"fields",
	Array.from(Array(1000).keys()).map((i) => atom("field", `Field #${i + 1}`)),
);

const Field = track(function Field({ field }: { field: Atom<string> }) {
	return (
		<div>
			Last {`<Field>`} render at: {new Date().toISOString()}
			&nbsp;
			<input value={field.value} onChange={(e) => field.set(e.target.value)} />
		</div>
	);
});

const App = track(function App() {
	return (
		<div>
			<div>
				Last {`<App>`} render at: {new Date().toISOString()}
			</div>
			<br />
			{fields.value.map((field, index) => (
				<Field key={index} field={field} />
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
