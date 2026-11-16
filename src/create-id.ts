let timestamp = 0;
let sequence = 0;
let prefix = "0Z";

export const createID = (): string => {
	const now = Date.now();

	// Keep the timestamp/sequence pair unique even if the clock moves backwards.
	if (now > timestamp) {
		timestamp = now;
		sequence = 0;
		prefix = `${timestamp.toString(32)}Z`;
	} else if (sequence === Number.MAX_SAFE_INTEGER) {
		timestamp++;
		sequence = 0;
		prefix = `${timestamp.toString(32)}Z`;
	} else {
		sequence++;
	}

	// Base 32 leaves Z as an unambiguous separator while keeping IDs alphanumeric.
	// Randomness also helps distinguish independent module instances/sessions.
	return `${prefix}${sequence.toString(32)}Z${(
		(Math.random() * 1e5) ^ 1
	).toString(32)}`.toUpperCase();
};
