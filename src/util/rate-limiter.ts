import { Application, NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';
import RateLimitException from '../exceptions/rate-limit-exception';

/* istanbul ignore if */
if (process.env.GLOBAL_RATE_LIMIT_POINTS === undefined)
	throw new Error('Configure GLOBAL_RATE_LIMIT_POINTS environment variable');

/* istanbul ignore if */
if (process.env.GLOBAL_RATE_LIMIT_DURATION_SECONDS === undefined)
	throw new Error(
		'Configure GLOBAL_RATE_LIMIT_DURATION_SECONDS environment variable',
	);

/* istanbul ignore if */
if (process.env.GLOBAL_RATE_LIMIT_BLOCK_DURATION_SECONDS === undefined)
	throw new Error(
		'Configure GLOBAL_RATE_LIMIT_BLOCK_DURATION_SECONDS environment variable',
	);

// Load environment variables for global rate limiter parameters
const points = Number(process.env.GLOBAL_RATE_LIMIT_POINTS);
const duration = Number(process.env.GLOBAL_RATE_LIMIT_DURATION_SECONDS);
const blockDuration = Number(
	process.env.GLOBAL_RATE_LIMIT_BLOCK_DURATION_SECONDS,
);

/** Global rate limiter for DoS protection */
const rateLimiter = new RateLimiterMemory({ points, duration, blockDuration });

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
			throw new RateLimitException(
				error.msBeforeNext,
				rateLimiter.points,
				error.remainingPoints,
			);

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
