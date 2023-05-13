import { Exome, addMiddleware } from "../src/exome";
import { exomeReduxDevtools } from "../src/devtools";

addMiddleware(
	exomeReduxDevtools({
		name: "Exome Playground",
	}),
);

interface Joke {
	id: number;
	type: string;
	setup: string;
	punchline: string;
}

export class JokeStore extends Exome {
	public joke: Joke = null;
	public isLoading = false;

	public async getJoke() {
		this.joke = await fetch(
			"https://official-joke-api.appspot.com/random_joke",
		).then<Joke>((response) => response.json());
	}

	public setLoading(isLoading: boolean) {
		this.isLoading = isLoading;
	}
}

addMiddleware((instance, action) => {
	if (instance instanceof JokeStore && action === "getJoke") {
		instance.setLoading(true);

		return () => {
			instance.setLoading(false);
		};
	}
});

export const jokeStore = new JokeStore();

export class CounterStore extends Exome {
	public count = 0;

	public increment() {
		this.count++;
	}

	public decrement() {
		this.count--;
	}

	public reset() {
		this.count = 0;
	}
}

export const counterStore = new CounterStore();

class Person extends Exome {
	constructor(public name: string, public friends: Person[]) {
		super();
	}

	public addFriend(friend: Person) {
		this.friends.push(friend);
	}
}

export const circularStore = new Person("John", []);

circularStore.addFriend(circularStore);
