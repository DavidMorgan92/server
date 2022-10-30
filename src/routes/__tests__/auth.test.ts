import request from 'supertest';
import app from '../../server';

jest.mock('../../services/auth-service');

describe('/auth', () => {
	describe('GET /login', () => {
		it('returns 200 OK with good input', async () => {
			const data = {
				username: 'dave',
				password: 'pass',
			};

			const res = await request(app).post('/auth/login').send(data);

			expect(res.status).toBe(200);
			expect(res.body).toEqual({
				accessToken: {
					token: 'mock access token',
					expiresAt: expect.any(String),
				},
				refreshToken: {
					token: 'mock refresh token',
					expiresAt: expect.any(String),
				},
			})
		});
	});
});
