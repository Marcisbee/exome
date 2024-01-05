import { Exome, addMiddleware, getExomeId, update } from "../src/exome";
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
	public joke: Joke | null = null;
	public get loading() {
		return getActionStatus(this, "getJoke").loading;
	}
	public get error() {
		return getActionStatus(this, "getJoke").error;
	}

	public async getJoke() {
		this.joke = await fetch(
			"https://official-joke-api.appspot.com/random_joke",
		).then<Joke>((response) => response.json());
	}
}

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

interface ActionStatusCacheObject {
	loading: boolean;
	error: false | Error;
	unsubscribe: () => void;
}

const actionStatusCache: Record<string, ActionStatusCacheObject> = {};
function getActionStatus<T extends Exome>(store: T, action: keyof T) {
	const key = getExomeId(store) + ":" + (action as string);
	let cached = actionStatusCache[key];

	if (cached) {
		return cached;
	}

	cached = actionStatusCache[key] = {
		loading: false,
		error: false,
		unsubscribe() {
			unsubscribe();
			actionStatusCache[key] = undefined as any;
		},
	};

	let actionIndex = 0;

	const unsubscribe = addMiddleware((instance, targetAction, payload) => {
		if (instance !== store || targetAction !== action || !cached) {
			return;
		}

		actionIndex++;
		const currentActionIndex = actionIndex;
		cached.loading = true;
		cached.error = false;

		update(instance);

		return (error) => {
			if (currentActionIndex !== actionIndex || !cached) {
				return;
			}

			cached.loading = false;
			cached.error = error || false;

			update(instance);
		};
	});

	return cached;
}
