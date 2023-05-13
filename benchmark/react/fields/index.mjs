/**
 * @param {HTMLElement} target
 */
export default async function run(target) {
	for (let i = 0; i < 100; i++) {
		const input = target.querySelectorAll("input")[10];
		const newValue = String(Math.random());
		const elementReactPromise = elementUpdatedTo(input, newValue);

		const evt = document.createEvent("HTMLEvents");
		evt.initEvent("input", true, true);
		input.value = newValue;
		input._valueTracker.setValue(Math.random());
		input.dispatchEvent(evt);

		await elementReactPromise;
	}
}

async function elementUpdatedTo(el, targetValue) {
	function isValid(text) {
		// rome-ignore lint/suspicious/noDoubleEquals: <explanation>
		return text == targetValue;
	}

	return new Promise((resolve, reject) => {
		if (isValid(el.value)) {
			resolve();
			return;
		}

		new MutationObserver((mutationRecords, observer) => {
			if (!isValid(el.value)) {
				return;
			}

			resolve();
			observer.disconnect();
		}).observe(el, {
			characterData: false,
			attributes: true,
			childList: false,
			subtree: false,
		});
	});
}
