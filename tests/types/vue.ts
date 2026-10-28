import { Exome } from "exome";
import { useStore } from "exome/vue";
import { type Ref, ref } from "vue";

class Child extends Exome {
	name = "child";
}

class Store extends Exome {
	count = 0;
	object = { count: ref(1) };
	items = [1, 2];
	existing = ref("hello");
	child = new Child();
	optional?: string;
	maybeChild: Child | null = null;
	get doubled() {
		return this.count * 2;
	}
	increment(amount: number): number {
		return (this.count += amount);
	}
}

const state = useStore(new Store());
state.count satisfies Ref<number>;
state.object satisfies Ref<{ count: number }>;
state.items satisfies Ref<number[]>;
state.existing satisfies Ref<string>;
state.child satisfies Child;
state.optional satisfies Ref<string | undefined>;
state.maybeChild satisfies Child | Ref<null>;
state.doubled satisfies Ref<number>;
state.increment satisfies (amount: number) => number;
state.increment(2) satisfies number;
state.count.value satisfies number;
state.object.value.count satisfies number;

// @ts-expect-error State is a ref, not the raw value.
state.count satisfies number;
// @ts-expect-error Methods retain their argument types.
state.increment("2");
// @ts-expect-error Nested stores are not wrapped in refs.
state.child.value;
// @ts-expect-error The adapter's properties remain readonly.
state.count = ref(3);
