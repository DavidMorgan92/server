/**
 * Represents an error caused by rate limit violation
 */
export default class RateLimitException {
	/** Milliseconds before user can retry */
	msBeforeNext: number;

	/** Total points allowed for a user */
	points: number;

	/** Points remaining for this user */
	remainingPoints: number;

	/** Date and time a user can retry */
	resetTime: Date;

	/**
	 * Construct with information for the calling user to be set in response headers
	 * @param msBeforeNext Milliseconds before user can retry
	 * @param points Total points allowed for a user
	 * @param remainingPoints Points remaining for this user
	 */
	constructor(msBeforeNext: number, points: number, remainingPoints: number) {
		this.msBeforeNext = msBeforeNext;
		this.points = points;
		this.remainingPoints = remainingPoints;
		this.resetTime = new Date(Date.now() + msBeforeNext);
	}
}
