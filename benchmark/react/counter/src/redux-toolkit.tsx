import { configureStore, createSlice } from "@reduxjs/toolkit";
export { version } from "../../../node_modules/@reduxjs/toolkit/package.json";
import { Provider, useDispatch, useSelector } from "react-redux";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const counterSlice = createSlice({
	name: "counter",
	initialState: {
		count: 0,
	},
	reducers: {
		increment: (state) => {
			state.count += 1;
		},
	},
});

const store = configureStore({
	reducer: {
		counter: counterSlice.reducer,
	},
});

function App() {
	const count = useSelector((state: any) => state.counter.count);
	const dispatch = useDispatch();

	return (
		<h1 onClick={clickAction(() => dispatch(counterSlice.actions.increment()))}>
			{count}
		</h1>
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

	return elementReady("h1");
}
