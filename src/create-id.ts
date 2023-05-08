export const createID = (): string =>
	(
		Date.now().toString(36) + ((Math.random() * 1e3) ^ 1).toString(36)
	).toUpperCase();
