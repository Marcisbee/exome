import React, { StrictMode } from "react";
import ReactDom from "react-dom/client";

import { useStore } from "../src/react";

import { Dog, dogAndy, dogStore, Person } from "./dogStore";
import { counterStore, jokeStore } from "./store";

function Joke() {
	const { joke, getJoke, isLoading } = useStore(jokeStore);

	return (
		<div>
			{joke && (
				<ul>
					<li>{joke.setup}</li>
					<li>{joke.punchline}</li>
				</ul>
			)}

			<button onClick={getJoke} disabled={isLoading}>
				Fetch new joke
			</button>
		</div>
	);
}

function Counter() {
	const { count, increment, decrement, reset } = useStore(counterStore);

	return (
		<div>
			<h1>{count}</h1>

			<button onClick={increment}>+</button>
			<button onClick={decrement}>-</button>
			<button onClick={reset}>reset</button>
		</div>
	);
}

function Dogs({ store }: { store: Dog }) {
	const dog = useStore(store);

	return <strong>{dog.name}</strong>;
}

function People({ store }: { store: Person }) {
	const person = useStore(store);

	return (
		<div>
			<strong>{person.name}</strong>
			{person.dogs.length ? (
				<div>
					- owner of:{" "}
					{person.dogs.map((dog, index) => (
						<Dogs key={`dog-${dog.name}-${index}`} store={dog} />
					))}
				</div>
			) : (
				<div>- owns no dogs</div>
			)}

			<button onClick={() => person.addDog(new Dog("Joly", "Husky"))}>
				add new dog
			</button>
			<br />
			<br />
		</div>
	);
}

function DogOwners() {
	const { persons, addPerson } = useStore(dogStore);

	return (
		<div>
			{persons.map((person, index) => (
				<People key={`person-${person.name}-${index}`} store={person} />
			))}

			<button onClick={() => addPerson(new Person("Samson Jo"))}>
				add new person
			</button>

			<button onClick={() => dogAndy.rename("Jeff")}>rename dog Andy</button>
		</div>
	);
}

function App() {
	return (
		<div>
			<Counter />

			<br />
			<hr />
			<br />

			<Joke />

			<br />
			<hr />
			<br />

			<DogOwners />
		</div>
	);
}

ReactDom.createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
