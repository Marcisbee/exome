/**
 * @param {HTMLElement} target
 */
export default async function run(target) {
	for (let i = 0; i < 1000; i++) {
		const h1 = target.querySelector("h1");
		const elementReactPromise = elementUpdatedTo(h1, i);

		h1.click();

		await elementReactPromise;
	}
}

async function elementUpdatedTo(el, targetValue) {
	function isValid(text) {
		// rome-ignore lint/suspicious/noDoubleEquals: <explanation>
		return text == targetValue;
	}

	return new Promise((resolve, reject) => {
		if (isValid(el.textContent)) {
			resolve();
			return;
		}

		new MutationObserver((mutationRecords, observer) => {
			if (!isValid(mutationRecords.slice(-1)[0].target?.textContent)) {
				return;
			}

			resolve();
			observer.disconnect();
		}).observe(el, {
			characterData: true,
			attributes: false,
			childList: true,
			subtree: true,
		});
	});
}
