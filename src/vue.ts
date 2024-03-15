import { Exome, subscribe } from "exome";
import { type Ref, ref, watchEffect } from "vue";

/**
 * Subscribes to store instance update events and trigger updates to component accordingly.
 *
 * @example:
 * ```ts
 * <script lang="ts" setup>
 *   import { useStore } from "exome/vue"
 *   import { counterStore } from "./counter.store.ts"
 *
 *   const { count, increment } = useStore(counterStore)
 * </script>
 *
 * <template>
 *   <button @click="increment()">{{ count }}</button>
 * </template>
 * ```
 */
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
