import request from 'supertest';
import app from '../../server';

jest.mock('../../services/auth-service');

describe('/auth', () => {
	describe('/login', () => {
		describe('POST', () => {
			it('returns access and refresh tokens with good credentials', async () => {
				const data = { email: 'dave@verified.com', password: 'pass' };

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
				});
			});

			it('responds with 401 if email is not matched', async () => {
				const data = { email: 'user.does.not@exist.com', password: 'pass' };

				const res = await request(app).post('/auth/login').send(data);

				expect(res.status).toBe(401);
				expect(res.body).toEqual({
					message: 'Could not find user with matching email',
				});
			});

			it('responds with 401 if user is unverified', async () => {
				const data = { email: 'dave@unverified.com', password: 'pass' };

				const res = await request(app).post('/auth/login').send(data);

				expect(res.status).toBe(401);
				expect(res.body).toEqual({ message: 'User not verified' });
			});

			it('responds with 401 if user is password is incorrect', async () => {
				const data = { email: 'dave@verified.com', password: 'bad-pass' };

				const res = await request(app).post('/auth/login').send(data);

				expect(res.status).toBe(401);
				expect(res.body).toEqual({ message: 'Incorrect password' });
			});

			it('responds with 400 if email is not given', async () => {
				const data = { password: 'pass' };

				const res = await request(app).post('/auth/login').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					email: { _errors: ['Required'] },
				});
			});

			it('responds with 400 if email is not a valid email', async () => {
				const data = { email: 'invalid.email', password: 'pass' };

				const res = await request(app).post('/auth/login').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					email: { _errors: ['Invalid email'] },
				});
			});

			it('responds with 400 if email is under 1 character', async () => {
				const data = { email: '', password: 'pass' };

				const res = await request(app).post('/auth/login').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					email: {
						_errors: [
							'Invalid email',
							'String must contain at least 1 character(s)',
						],
					},
				});
			});

			it('responds with 400 if email is over 100 characters', async () => {
				const data = {
					email: 'valid@' + new Array(91).fill('a').join('') + '.com',
					password: 'pass',
				};

				const res = await request(app).post('/auth/login').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					email: { _errors: ['String must contain at most 100 character(s)'] },
				});
			});

			it('responds with 400 if password is not given', async () => {
				const data = { email: 'valid@email.com' };

				const res = await request(app).post('/auth/login').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					password: { _errors: ['Required'] },
				});
			});

			it('responds with 400 if password is under 1 character', async () => {
				const data = { email: 'valid@email.com', password: '' };

				const res = await request(app).post('/auth/login').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					password: {
						_errors: ['String must contain at least 1 character(s)'],
					},
				});
			});

			it('responds with 400 if password is over 100 characters', async () => {
				const data = {
					email: 'valid@email.com',
					password: new Array(101).fill('a').join(''),
				};

				const res = await request(app).post('/auth/login').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					password: {
						_errors: ['String must contain at most 100 character(s)'],
					},
				});
			});
		});
	});
});
