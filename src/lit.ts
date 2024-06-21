import { type Exome, subscribe } from "exome";
import type { ReactiveController, ReactiveControllerHost } from "lit";

/**
 * Subscribes to store instance update events and trigger updates to component accordingly.
 *
 * @example:
 * ```ts
 * import { StoreController } from "exome/lit"
 * import { counterStore } from "./counter.store.ts"
 *
 * @customElement("counter")
 * class CounterComponent extends LitElement {
 *   private counter = new StoreController(this, counterStore)
 *
 *   render() {
 *     const { count, increment } = this.counter.store
 *
 *     return html`
 *       <button @click=${increment}>${count}</button>
 *     `
 *   }
 * }
 * ```
 */
export class StoreController<T extends Exome> implements ReactiveController {
	private unsubscribe: undefined | (() => void);

	constructor(
		private host: ReactiveControllerHost,
		public store: T,
	) {
		host.addController(this);
	}

	hostConnected() {
		this.unsubscribe = subscribe(this.store, () => {
			this.host.requestUpdate();
		});
	}

	hostDisconnected() {
		this.unsubscribe?.();
	}
}
