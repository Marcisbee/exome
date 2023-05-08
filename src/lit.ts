import { Exome, subscribe } from "exome";
import { ReactiveController, ReactiveControllerHost } from "lit";

export class StoreController<T extends Exome> implements ReactiveController {
	private unsubscribe: undefined | (() => void);

	constructor(private host: ReactiveControllerHost, public store: T) {
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
