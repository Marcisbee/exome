import { configureStore, createSlice } from "@reduxjs/toolkit";
export { version } from "../../../node_modules/@reduxjs/toolkit/package.json";
import { Provider, useDispatch, useSelector } from "react-redux";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";

const fieldsSlice = createSlice({
	name: "fields",
	initialState: {
		fields: Array.from(Array(1000).keys()).map((i) => `Field #${i + 1}`),
	},
	reducers: {
		rename: (state, action) => {
			state.fields[action.payload.index] = action.payload.value;
		},
	},
});

const store = configureStore({
	reducer: {
		fields: fieldsSlice.reducer,
	},
});

function Field({ index, field: name }: { index: number; field: string }) {
	const dispatch = useDispatch();

	return (
		<div>
			Last {`<Field>`} render at: {new Date().toISOString()}
			&nbsp;
			<input
				value={name}
				onChange={(e) =>
					dispatch(fieldsSlice.actions.rename({ index, value: e.target.value }))
				}
			/>
		</div>
	);
}

function App() {
	const fields: string[] = useSelector(
		(state: any) => state.fields.fields,
		() => false,
	);

	return (
		<div>
			<div>
				Last {`<App>`} render at: {new Date().toISOString()}
			</div>
			<br />
			{fields.map((field, index) => (
				<Field key={index} index={index} field={field} />
			))}
			<h1>foot</h1>
		</div>
	);
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(
		<Provider store={store} key={key++}>
			<App />
		</Provider>,
	);

	await new Promise((resolve) => setTimeout(resolve, 10));

	return elementReady("h1");
}
