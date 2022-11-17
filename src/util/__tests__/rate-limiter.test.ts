import request from 'supertest';
import express from 'express';
import { initGlobalRateLimiter } from '../rate-limiter';

describe('app global rate limiter', () => {
	it('responds with 500 if rate limit is exceeded', async () => {
		// Create an express app with the global rate limiter middleware
		const app = express();
		initGlobalRateLimiter(app);
		app.get('/', (_req, res) => res.sendStatus(200));

		// Execute as many requests as are allowed, expect them to succeed
		for (let i = 0; i < Number(process.env.GLOBAL_RATE_LIMIT_POINTS); ++i) {
			const res = await request(app).get('/');
			expect(res.status).toBe(200);
		}

		// Execute one more request, expect it to fail
		const res = await request(app).get('/');
		expect(res.status).toBe(500);
	});
});
