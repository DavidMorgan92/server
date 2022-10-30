import { NextFunction, Response, Request } from 'express';
import { ZodError } from 'zod';
import HttpException from '../exceptions/http-exception';
import RateLimitException from '../exceptions/rate-limit-exception';

/**
 * Custom error handler
 * @param error Error object
 * @param res Response
 */
export default function errorHandler(
	error: any,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void {
	// If it is a ZodError
	if (error instanceof ZodError) {
		// Respond with 400 and list of errors
		res.status(400).json(error.format());
		return;
	}

	// If it is a RateLimitError
	if (error instanceof RateLimitException) {
		// Set Retry-After header to number of seconds to wait and respond with 429
		res.set('Retry-After', String(error.retrySeconds));
		res.sendStatus(429);
		return;
	}

	// If it is an HttpException
	if (error instanceof HttpException) {
		// Respond with only status code if there is no message
		if (!error.message) {
			res.sendStatus(error.status);
			return;
		}

		// Respond with status code and message if there is one
		res.status(error.status).json({ message: error.message });
		return;
	}

	// Respond only with 500 status code if it is not a reportable error
	res.sendStatus(500);
}
