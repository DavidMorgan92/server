import request from 'supertest';
import express from 'express';
import { initRateLimiter } from '../rate-limiter';

describe('app global rate limiter', () => {
	it('throws if rate limit is exceeded', async () => {
		const app = express();
		initRateLimiter(app);
		app.get('/', (_req, res) => res.sendStatus(200));

		for (let i = 0; i < Number(process.env.GLOBAL_RATE_LIMIT_POINTS); ++i)
			await request(app).get('/');

		const res = await request(app).get('/');

		expect(res.status).toBe(500);
	});
});

