import RateLimitException from '../rate-limit-exception';

describe('RateLimitException', () => {
	describe('constructor', () => {
		it('stores values passed to constructor', () => {
			const exception = new RateLimitException(100, 200, 300);
			expect(exception.msBeforeNext).toBe(100);
			expect(exception.points).toBe(200);
			expect(exception.remainingPoints).toBe(300);
			expect(exception.resetTime).toEqual(expect.any(Date));
		});
	});
});

