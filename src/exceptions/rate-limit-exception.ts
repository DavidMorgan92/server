/**
 * Represents an error caused by rate limit violation
 */
export default class RateLimitException {
	/** Number of seconds to wait given in Retry-After header */
	retrySeconds: number;

	/**
	 * Construct with number of seconds to wait before retry
	 * @param retrySeconds Number of seconds to wait given in Retry-After header
	 */
	constructor(retrySeconds = 1) {
		this.retrySeconds = retrySeconds;
	}
}
