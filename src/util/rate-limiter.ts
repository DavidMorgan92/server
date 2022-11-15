import { Application, NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';
import RateLimitException from '../exceptions/rate-limit-exception';

/** Global rate limiter for DoS protection */
const rateLimiter = new RateLimiterMemory({
	points: 5,					// 5 points
	duration: 1,				// per second
	blockDuration: 1,		// block for 1 second if limit is exceeded
});

/**
 * Express middleware for global rate limiter
 * @param req Request
 * @param _res Response
 * @param next Next function
 */
async function rateLimiterMiddleware(
	req: Request,
	_res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		// Consume a point for the request's IP
		await rateLimiter.consume(req.ip);

		// Call the next function
		next();
	} catch (error) {
		// Throw RateLimitException if error is a RateLimiterRes
		if (error instanceof RateLimiterRes)
			throw new RateLimitException(rateLimiter.blockDuration);

		// Rethrow the error if it is not rate limiter related
		throw error;
	}
}

/**
 * Use the global rate limiter middleware
 * @param app The express application
 */
export function initRateLimiter(app: Application) {
	app.use(expressAsyncHandler(rateLimiterMiddleware));
}
