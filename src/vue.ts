import { addMiddleware, Exome, getExomeId, Middleware, updateMap } from "exome";
import { Ref, ref, watchEffect } from "vue";

const vueMiddleware: Middleware = (instance) => {
	return () => {
		const id = getExomeId(instance);
		const renderers = updateMap[id] === undefined ? [] : updateMap[id];

		updateMap[id] = [];

		renderers.forEach((renderer) => renderer());
	};
};

addMiddleware(vueMiddleware);

export function useStore<T extends Exome>(store: T): Readonly<T> {
	const id = getExomeId(store);
	const _ = ref(false);
	const refs: Record<string, Ref<any>> = {};

	function render() {
		Object.keys(refs).forEach((key) => {
			refs[key].value = (store as any)[key];
		});
		_.value = !_.value;
	}

	watchEffect(
		() => {
			// Set ref dependency
			_.value;

			if (!updateMap[id]) {
				updateMap[id] = [];
			}

			const queue = updateMap[id]!;

			queue.push(render);

			return () => {
				if (queue === updateMap[id]!) {
					const index = queue.indexOf(render);

					if (index === -1) {
						return;
					}

					queue.splice(index, 1);
				}
			};
		},
		{
			flush: "pre",
		},
	);

	if (!id) {
		throw new Error(
			'"useStore" received value that is not an instance of "Exome"',
		);
	}

	return new Proxy(store, {
		get(target: any, key: string) {
			if (target === store && typeof target[key] === "function") {
				return target[key];
			}

			if (target && target[key] instanceof Exome) {
				return target[key];
			}

			return refs[key] || (refs[key] = ref(target[key]));
		},
	});
}
