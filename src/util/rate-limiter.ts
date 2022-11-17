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
const globalPoints = Number(process.env.GLOBAL_RATE_LIMIT_POINTS);
const globalDuration = Number(process.env.GLOBAL_RATE_LIMIT_DURATION_SECONDS);
const globalBlockDuration = Number(
	process.env.GLOBAL_RATE_LIMIT_BLOCK_DURATION_SECONDS,
);

/** Global rate limiter for DoS protection */
const globalRateLimiter = new RateLimiterMemory({
	points: globalPoints,
	duration: globalDuration,
	blockDuration: globalBlockDuration,
});

/**
 * Express middleware for global rate limiter
 * @param req Request
 * @param _res Response
 * @param next Next function
 */
async function globalRateLimiterMiddleware(
	req: Request,
	_res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		// Consume a point for the request's IP
		await globalRateLimiter.consume(req.ip);

		// Call the next function
		next();
	} catch (error) {
		// Throw RateLimitException if error is a RateLimiterRes
		if (error instanceof RateLimiterRes)
			throw new RateLimitException(
				error.msBeforeNext,
				globalRateLimiter.points,
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
export function initGlobalRateLimiter(app: Application): void {
	app.use(expressAsyncHandler(globalRateLimiterMiddleware));
}
