import { Application, Request, Response, NextFunction } from 'express';
import expressAsyncHandler from 'express-async-handler';

/**
 * Mock global rate limiter middleware
 */
async function globalRateLimiterMiddleware(
	_req: Request,
	_res: Response,
	next: NextFunction,
): Promise<void> {
	// Just go to next function, don't rate limit
	next();
}

/**
 * Add the mock rate limiter middleware to the express app
 * @param app Express application
 */
export function initGlobalRateLimiter(app: Application): void {
	app.use(expressAsyncHandler(globalRateLimiterMiddleware));
}
