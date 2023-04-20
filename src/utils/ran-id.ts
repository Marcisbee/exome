export function ranID(): string {
	const now = Date.now().toString(36);
	const random = Math.random().toString(36).substr(2, 5);

	return (now + random).toUpperCase();
}
