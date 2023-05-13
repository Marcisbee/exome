import { Exome, subscribe } from "exome";
import { type Ref, watchEffect, ref } from "vue";

export function useStore<T extends Exome>(store: T): Readonly<T> {
	const refs: Record<string, Ref<any>> = {};

	function render() {
		Object.keys(refs).forEach((key) => {
			refs[key].value = (store as any)[key];
		});
	}

	watchEffect(() => subscribe(store, render), {
		flush: "pre",
	});

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
