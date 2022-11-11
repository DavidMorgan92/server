import request from 'supertest';
import passport from 'passport';
import { MockStrategy } from 'passport-mock-strategy';
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

			it('responds with 400 if password is not given', async () => {
				const data = { email: 'valid@email.com' };

				const res = await request(app).post('/auth/login').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					password: { _errors: ['Required'] },
				});
			});
		});
	});

	describe('/token', () => {
		describe('POST', () => {
			it('responds with 200 with good input', async () => {
				const data = {
					email: 'dave@verified.com',
					refreshToken: 'mock refresh token',
				};

				const res = await request(app).post('/auth/token').send(data);

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
				const data = {
					email: 'user.does.not@exist.com',
					refreshToken: 'mock refresh token',
				};

				const res = await request(app).post('/auth/token').send(data);

				expect(res.status).toBe(401);
				expect(res.body).toEqual({
					message: 'Could not find user with matching email',
				});
			});

			it('responds with 401 if user is unverified', async () => {
				const data = {
					email: 'dave@unverified.com',
					refreshToken: 'mock refresh token',
				};

				const res = await request(app).post('/auth/token').send(data);

				expect(res.status).toBe(401);
				expect(res.body).toEqual({ message: 'User not verified' });
			});

			it('responds with 401 if token does not exist in store', async () => {
				const data = {
					email: 'dave@verified.com',
					refreshToken: 'non-existant token',
				};

				const res = await request(app).post('/auth/token').send(data);

				expect(res.status).toBe(401);
				expect(res.body).toEqual({ message: 'Invalid refresh token' });
			});

			it('responds with 401 if token does not belong to the given user', async () => {
				const data = {
					email: 'dave@verified.com',
					refreshToken: 'refresh token for wrong user',
				};

				const res = await request(app).post('/auth/token').send(data);

				expect(res.status).toBe(401);
				expect(res.body).toEqual({
					message: 'Refresh token does not belong to the user',
				});
			});

			it('responds with 401 if token is expired', async () => {
				const data = {
					email: 'dave@verified.com',
					refreshToken: 'expired refresh token',
				};

				const res = await request(app).post('/auth/token').send(data);

				expect(res.status).toBe(401);
				expect(res.body).toEqual({ message: 'Expired refresh token' });
			});

			it('responds with 400 if email is not given', async () => {
				const data = { refreshToken: 'mock refresh token' };

				const res = await request(app).post('/auth/token').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					email: { _errors: ['Required'] },
				});
			});

			it('responds with 400 if refresh token is not given', async () => {
				const data = { email: 'dave@verified.com' };

				const res = await request(app).post('/auth/token').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					refreshToken: { _errors: ['Required'] },
				});
			});
		});
	});

	describe('/register', () => {
		describe('POST', () => {
			it('responds with 200 with good input', async () => {
				const data = {
					email: 'new@user.com',
					password: 'pass',
					displayName: 'New User',
				};

				const res = await request(app).post('/auth/register').send(data);

				expect(res.status).toBe(200);
				expect(res.body).toEqual('');
			});

			it('responds with 500 if the email is already registered', async () => {
				const data = {
					email: 'dave@verified.com',
					password: 'pass',
					displayName: 'New User',
				};

				const res = await request(app).post('/auth/register').send(data);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'Email is already registered' });
			});

			it('responds with 400 if email is not given', async () => {
				const data = {
					password: 'pass',
					displayName: 'New User',
				};

				const res = await request(app).post('/auth/register').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					email: { _errors: ['Required'] },
				});
			});

			it('responds with 400 if email is not a valid email', async () => {
				const data = {
					email: 'invalid.email',
					password: 'pass',
					displayName: 'New User',
				};

				const res = await request(app).post('/auth/register').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					email: { _errors: ['Invalid email'] },
				});
			});

			it('responds with 400 if email is under 1 character', async () => {
				const data = {
					email: '',
					password: 'pass',
					displayName: 'New User',
				};

				const res = await request(app).post('/auth/register').send(data);

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
					displayName: 'New User',
				};

				const res = await request(app).post('/auth/register').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					email: { _errors: ['String must contain at most 100 character(s)'] },
				});
			});

			it('responds with 400 if password is not given', async () => {
				const data = {
					email: 'valid@email.com',
					displayName: 'New User',
				};

				const res = await request(app).post('/auth/register').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					password: { _errors: ['Required'] },
				});
			});

			it('responds with 400 if password is under 1 character', async () => {
				const data = {
					email: 'valid@email.com',
					password: '',
					displayName: 'New User',
				};

				const res = await request(app).post('/auth/register').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					password: {
						_errors: ['String must contain at least 1 character(s)'],
					},
				});
			});

			it('responds with 400 if password is over 100 characters', async () => {
				const password = new Array(101).fill('a').join('');

				const data = {
					email: 'valid@email.com',
					password: password,
					displayName: 'New User',
				};

				const res = await request(app).post('/auth/register').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					password: {
						_errors: ['String must contain at most 100 character(s)'],
					},
				});
			});

			it('responds with 400 if displayName is not given', async () => {
				const data = {
					email: 'valid@email.com',
					password: 'pass',
				};

				const res = await request(app).post('/auth/register').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					displayName: { _errors: ['Required'] },
				});
			});

			it('responds with 400 if displayName is under 1 character', async () => {
				const data = {
					email: 'valid@email.com',
					password: 'pass',
					displayName: '',
				};

				const res = await request(app).post('/auth/register').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					displayName: {
						_errors: ['String must contain at least 1 character(s)'],
					},
				});
			});

			it('responds with 400 if displayName is over 100 characters', async () => {
				const data = {
					email: 'valid@email.com',
					password: 'pass',
					displayName: new Array(101).fill('a').join(''),
				};

				const res = await request(app).post('/auth/register').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					displayName: {
						_errors: ['String must contain at most 100 character(s)'],
					},
				});
			});

			it('responds with 400 if displayName is all whitespace', async () => {
				const data = {
					email: 'valid@email.com',
					password: 'pass',
					displayName: ' \t\r\n',
				};

				const res = await request(app).post('/auth/register').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					displayName: {
						_errors: ['String must contain at least 1 character(s)'],
					},
				});
			});
		});
	});

	describe('/delete', () => {
		it('deletes a user', async () => {
			passport.use(
				new MockStrategy({
					user: {
						id: '1',
						name: { familyName: '', givenName: '' },
						emails: [{ value: '', type: '' }],
						provider: '',
					},
				}),
			);

			const res = await request(app).post('/auth/delete');

			expect(res.status).toBe(200);
			expect(res.body).toEqual({});
		});
	});
});
