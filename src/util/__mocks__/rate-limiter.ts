import { Application, Request, Response, NextFunction } from 'express';
import expressAsyncHandler from 'express-async-handler';

async function rateLimiterMiddleware(
	_req: Request,
	_res: Response,
	next: NextFunction,
): Promise<void> {
	next();
}

export function initRateLimiter(app: Application) {
	app.use(expressAsyncHandler(rateLimiterMiddleware));
}

