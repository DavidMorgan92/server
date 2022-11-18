import { ZodError } from 'zod';
import HttpException from '../../exceptions/http-exception';
import RateLimitException from '../../exceptions/rate-limit-exception';
import errorHandler from '../error-handler';

let res: any;

beforeEach(() => {
	res = {
		status: jest.fn(() => res),
		json: jest.fn(),
		sendStatus: jest.fn(),
		set: jest.fn(),
	};
});

describe('errorHandler', () => {
	it('sets status to 400 and passes error.format if error is ZodError', () => {
		const error = new ZodError([
			{
				message: 'error',
				code: 'custom',
				path: ['path'],
			},
		]);

		errorHandler(error, undefined, res, undefined);

		expect(res.status).toHaveBeenCalledTimes(1);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledTimes(1);
		expect(res.json).toHaveBeenCalledWith(error.format());
		expect(res.sendStatus).not.toHaveBeenCalled();
		expect(res.set).not.toHaveBeenCalled();
	});

	it('sets status to 429 and sets headers if error is RateLimitException', () => {
		const error = new RateLimitException(1000, 10, 1);

		errorHandler(error, undefined, res, undefined);

		expect(res.sendStatus).toHaveBeenCalledTimes(1);
		expect(res.sendStatus).toHaveBeenCalledWith(429);
		expect(res.set).toHaveBeenCalledTimes(4);
		expect(res.set).toHaveBeenCalledWith(
			'Retry-After',
			String(error.msBeforeNext / 1000),
		);
		expect(res.set).toHaveBeenCalledWith(
			'X-RateLimit-Limit',
			String(error.points),
		);
		expect(res.set).toHaveBeenCalledWith(
			'X-RateLimit-Remaining',
			String(error.remainingPoints),
		);
		expect(res.set).toHaveBeenCalledWith(
			'X-RateLimit-Reset',
			error.resetTime.toISOString(),
		);
		expect(res.json).not.toHaveBeenCalled();
		expect(res.status).not.toHaveBeenCalled();
	});

	it('sets status 500 and sends no message if error is default HttpException', () => {
		const error = new HttpException();

		errorHandler(error, undefined, res, undefined);

		expect(res.sendStatus).toHaveBeenCalledTimes(1);
		expect(res.sendStatus).toHaveBeenCalledWith(500);
		expect(res.json).not.toHaveBeenCalled();
		expect(res.status).not.toHaveBeenCalled();
		expect(res.set).not.toHaveBeenCalled();
	});

	it('sets status to the one provided and sends no message if error is HttpException and status is provided', () => {
		const error = new HttpException(123);

		errorHandler(error, undefined, res, undefined);

		expect(res.sendStatus).toHaveBeenCalledTimes(1);
		expect(res.sendStatus).toHaveBeenCalledWith(123);
		expect(res.json).not.toHaveBeenCalled();
		expect(res.status).not.toHaveBeenCalled();
		expect(res.set).not.toHaveBeenCalled();
	});

	it('sets status to the one provided and sends the message provided if error is HttpException and both are provided', () => {
		const error = new HttpException(123, 'custom message');

		errorHandler(error, undefined, res, undefined);

		expect(res.status).toHaveBeenCalledTimes(1);
		expect(res.status).toHaveBeenCalledWith(123);
		expect(res.json).toHaveBeenCalledTimes(1);
		expect(res.json).toHaveBeenCalledWith({ message: error.message });
		expect(res.sendStatus).not.toHaveBeenCalled();
		expect(res.set).not.toHaveBeenCalled();
	});

	it('sets status to 500 if error is not one of the special types', () => {
		const error = new Error();

		errorHandler(error, undefined, res, undefined);

		expect(res.sendStatus).toHaveBeenCalledTimes(1);
		expect(res.sendStatus).toHaveBeenCalledWith(500);
		expect(res.status).not.toHaveBeenCalled();
		expect(res.json).not.toHaveBeenCalled();
		expect(res.set).not.toHaveBeenCalled();
	});
});

