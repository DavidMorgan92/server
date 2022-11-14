import request from 'supertest';
import passport from 'passport';
import { MockStrategy, DoneCallback } from '../../util/mock-strategy';
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

			it('responds with 401 if user is deleted', async () => {
				const data = { email: 'dave@deleted.com', password: 'pass' };

				const res = await request(app).post('/auth/login').send(data);

				expect(res.status).toBe(401);
				expect(res.body).toEqual({ message: 'User is deleted' });
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

			it('responds with 401 if user is deleted', async () => {
				const data = {
					email: 'dave@deleted.com',
					refreshToken: 'mock refresh token',
				};

				const res = await request(app).post('/auth/token').send(data);

				expect(res.status).toBe(401);
				expect(res.body).toEqual({ message: 'User is deleted' });
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
				expect(res.body).toEqual({});
			});

			it('responds with 200 if the email is already registered and the user is deleted', async () => {
				const data = {
					email: 'dave@deleted.com',
					password: 'pass',
					displayName: 'New User',
				};

				const res = await request(app).post('/auth/register').send(data);

				expect(res.status).toBe(200);
				expect(res.body).toEqual({});
			});

			it('responds with 500 if the email is already registered and the user is not deleted', async () => {
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
		describe('POST', () => {
			it('responds with 200 if user is authenticated, verified and not deleted', async () => {
				passport.use(new MockStrategy({ user: { id: 1 } }));

				const res = await request(app).post('/auth/delete');

				expect(res.status).toBe(200);
				expect(res.body).toEqual({});
			});

			it('responds with 401 if user is unauthenticated', async () => {
				passport.use(
					new MockStrategy(undefined, (_user: any, done: DoneCallback) => {
						// Indicate no matching user
						done();
					}),
				);

				const res = await request(app).post('/auth/delete');

				expect(res.status).toBe(401);
				expect(res.body).toEqual({});
			});

			it('responds with 401 if user is undefined', async () => {
				passport.use(new MockStrategy({ user: undefined }));

				const res = await request(app).post('/auth/delete');

				expect(res.status).toBe(401);
				expect(res.body).toEqual({});
			});

			it('responds with 401 if user ID is undefined', async () => {
				passport.use(new MockStrategy({ user: { id: undefined } }));

				const res = await request(app).post('/auth/delete');

				expect(res.status).toBe(401);
				expect(res.body).toEqual({});
			});

			it('responds with 500 if user ID is not found', async () => {
				passport.use(new MockStrategy({ user: { id: -1 } }));

				const res = await request(app).post('/auth/delete');

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'User does not exist' });
			});

			it('responds with 500 if user is deleted', async () => {
				passport.use(new MockStrategy({ user: { id: 3 } }));

				const res = await request(app).post('/auth/delete');

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'User is deleted' });
			});

			it('responds with 500 if user is not verified', async () => {
				passport.use(new MockStrategy({ user: { id: 2 } }));

				const res = await request(app).post('/auth/delete');

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'User not verified' });
			});
		});
	});

	describe('/verify', () => {
		describe('GET', () => {
			it('responds with 200 with good token and unverified account', async () => {
				const token = 'mock verification token';

				const res = await request(app).get(`/auth/verify?token=${token}`);

				expect(res.status).toBe(200);
				expect(res.body).toEqual({});
			});

			it('responds with 500 with non-existent token', async () => {
				const token = 'non-existent token';

				const res = await request(app).get(`/auth/verify?token=${token}`);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'Invalid verification token' });
			});

			it('responds with 500 with expired token', async () => {
				const token = 'expired verification token';

				const res = await request(app).get(`/auth/verify?token=${token}`);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'Expired verification token' });
			});

			it('responds with 500 with token for non-existent user', async () => {
				const token = 'verification token with bad user ID';

				const res = await request(app).get(`/auth/verify?token=${token}`);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'Failed to update user record' });
			});

			it('responds with 500 with token for deleted user', async () => {
				const token = 'verification token for deleted user';

				const res = await request(app).get(`/auth/verify?token=${token}`);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'User is deleted' });
			});

			it('responds with 500 with token for already verified user', async () => {
				const token = 'verification token for verified user';

				const res = await request(app).get(`/auth/verify?token=${token}`);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'User already verified' });
			});

			it('responds with 400 if no token is given', async () => {
				const res = await request(app).get('/auth/verify');

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					token: { _errors: ['Required'] },
				});
			});
		});
	});

	describe('/resend-verification', () => {
		describe('POST', () => {
			it('responds with 200 for unverified account', async () => {
				const data = { email: 'dave2@unverified.com' };

				const res = await request(app)
					.post('/auth/resend-verification')
					.send(data);

				expect(res.status).toBe(200);
				expect(res.body).toEqual({});
			});

			it('responds with 500 with non-existent email', async () => {
				const data = { email: 'user.does.not@exist.com' };

				const res = await request(app)
					.post('/auth/resend-verification')
					.send(data);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({
					message: 'Could not find user with matching email',
				});
			});

			it('responds with 500 if user is deleted', async () => {
				const data = { email: 'dave@deleted.com' };

				const res = await request(app)
					.post('/auth/resend-verification')
					.send(data);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'User is deleted' });
			});

			it('responds with 500 if user is already verified', async () => {
				const data = { email: 'dave2@verified.com' };

				const res = await request(app)
					.post('/auth/resend-verification')
					.send(data);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'User already verified' });
			});

			it('responds with 400 if email is not given', async () => {
				const data = {};

				const res = await request(app)
					.post('/auth/resend-verification')
					.send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					email: { _errors: ['Required'] },
				});
			});
		});
	});

	describe('/forgot-password', () => {
		describe('POST', () => {
			it('responds with 200 for verified account', async () => {
				const data = { email: 'dave2@verified.com' };

				const res = await request(app).post('/auth/forgot-password').send(data);

				expect(res.status).toBe(200);
				expect(res.body).toEqual({});
			});

			it('responds with 500 with non-existent email', async () => {
				const data = { email: 'user.does.not@exist.com' };

				const res = await request(app).post('/auth/forgot-password').send(data);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({
					message: 'Could not find user with matching email',
				});
			});

			it('responds with 500 if user is deleted', async () => {
				const data = { email: 'dave@deleted.com' };

				const res = await request(app).post('/auth/forgot-password').send(data);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'User is deleted' });
			});

			it('responds with 500 if user is not verified', async () => {
				const data = { email: 'dave2@unverified.com' };

				const res = await request(app).post('/auth/forgot-password').send(data);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'User not verified' });
			});

			it('responds with 400 if email is not given', async () => {
				const data = {};

				const res = await request(app).post('/auth/forgot-password').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					email: { _errors: ['Required'] },
				});
			});
		});
	});

	describe('/reset-password', () => {
		describe('POST', () => {
			it('responds with 200 with good token and password', async () => {
				const data = {
					newPassword: 'pass',
					token: 'mock forgot password token 2',
				};

				const res = await request(app).post('/auth/reset-password').send(data);

				expect(res.status).toBe(200);
				expect(res.body).toEqual({});
			});

			it('responds with 500 with non-existent token', async () => {
				const data = {
					newPassword: 'pass',
					token: 'non-existent token',
				};

				const res = await request(app).post('/auth/reset-password').send(data);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'Invalid forgot password token' });
			});

			it('responds with 500 with expired token', async () => {
				const data = {
					newPassword: 'pass',
					token: 'expired forgot password token',
				};

				const res = await request(app).post('/auth/reset-password').send(data);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'Expired forgot password token' });
			});

			it('responds with 500 with token with bad user ID', async () => {
				const data = {
					newPassword: 'pass',
					token: 'forgot password token with invalid user ID',
				};

				const res = await request(app).post('/auth/reset-password').send(data);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'Failed to update user record' });
			});

			it('responds with 500 with token with deleted user', async () => {
				const data = {
					newPassword: 'pass',
					token: 'forgot password token with deleted user',
				};

				const res = await request(app).post('/auth/reset-password').send(data);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'User is deleted' });
			});

			it('responds with 500 with token with unverified user', async () => {
				const data = {
					newPassword: 'pass',
					token: 'forgot password token with unverified user',
				};

				const res = await request(app).post('/auth/reset-password').send(data);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'User not verified' });
			});

			it('responds with 400 if new password is not given', async () => {
				const data = {
					token: 'forgot password token with unverified user',
				};

				const res = await request(app).post('/auth/reset-password').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					newPassword: { _errors: ['Required'] },
				});
			});

			it('responds with 400 if new password is under 1 character', async () => {
				const data = {
					newPassword: '',
					token: 'forgot password token with unverified user',
				};

				const res = await request(app).post('/auth/reset-password').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					newPassword: {
						_errors: ['String must contain at least 1 character(s)'],
					},
				});
			});

			it('responds with 400 if new password is over 100 characters', async () => {
				const password = new Array(101).fill('a').join('');

				const data = {
					newPassword: password,
					token: 'forgot password token with unverified user',
				};

				const res = await request(app).post('/auth/reset-password').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					newPassword: {
						_errors: ['String must contain at most 100 character(s)'],
					},
				});
			});

			it('responds with 400 if token is not given', async () => {
				const data = { newPassword: 'pass' };

				const res = await request(app).post('/auth/reset-password').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					token: { _errors: ['Required'] },
				});
			});
		});
	});

	describe('/change-password', () => {
		describe('POST', () => {
			it('responds with 200 with good input', async () => {
				passport.use(new MockStrategy({ user: { id: 6 } }));

				const data = { password: 'pass', newPassword: 'pass' };

				const res = await request(app).post('/auth/change-password').send(data);

				expect(res.status).toBe(200);
				expect(res.body).toEqual({});
			});

			it('responds with 401 if user is unauthenticated', async () => {
				passport.use(
					new MockStrategy(undefined, (_user: any, done: DoneCallback) => {
						// Indicate no matching user
						done();
					}),
				);

				const res = await request(app).post('/auth/change-password');

				expect(res.status).toBe(401);
				expect(res.body).toEqual({});
			});

			it('responds with 401 if user is undefined', async () => {
				passport.use(new MockStrategy({ user: undefined }));

				const res = await request(app).post('/auth/change-password');

				expect(res.status).toBe(401);
				expect(res.body).toEqual({});
			});

			it('responds with 401 if user ID is undefined', async () => {
				passport.use(new MockStrategy({ user: { id: undefined } }));

				const res = await request(app).post('/auth/change-password');

				expect(res.status).toBe(401);
				expect(res.body).toEqual({});
			});

			it('responds with 500 when user does not exist in storage', async () => {
				passport.use(new MockStrategy({ user: { id: -1 } }));

				const data = { password: 'pass', newPassword: 'pass' };

				const res = await request(app).post('/auth/change-password').send(data);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'Failed to update user record' });
			});

			it('responds with 500 when user is deleted', async () => {
				passport.use(new MockStrategy({ user: { id: 7 } }));

				const data = { password: 'pass', newPassword: 'pass' };

				const res = await request(app).post('/auth/change-password').send(data);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'User is deleted' });
			});

			it('responds with 500 when user is unverified', async () => {
				passport.use(new MockStrategy({ user: { id: 8 } }));

				const data = { password: 'pass', newPassword: 'pass' };

				const res = await request(app).post('/auth/change-password').send(data);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'User not verified' });
			});

			it('responds with 500 when password is incorrect', async () => {
				passport.use(new MockStrategy({ user: { id: 6 } }));

				const data = { password: 'incorrect password', newPassword: 'pass' };

				const res = await request(app).post('/auth/change-password').send(data);

				expect(res.status).toBe(500);
				expect(res.body).toEqual({ message: 'Incorrect password' });
			});

			it('responds with 400 when password is not given', async () => {
				passport.use(new MockStrategy({ user: { id: 6 } }));

				const data = { newPassword: 'pass' };

				const res = await request(app).post('/auth/change-password').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					password: { _errors: ['Required'] },
				});
			});

			it('responds with 400 when newPassword is not given', async () => {
				passport.use(new MockStrategy({ user: { id: 6 } }));

				const data = { password: 'pass' };

				const res = await request(app).post('/auth/change-password').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					newPassword: { _errors: ['Required'] },
				});
			});

			it('responds with 400 when newPassword is less than 1 character', async () => {
				passport.use(new MockStrategy({ user: { id: 6 } }));

				const data = { password: 'pass', newPassword: '' };

				const res = await request(app).post('/auth/change-password').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					newPassword: {
						_errors: ['String must contain at least 1 character(s)'],
					},
				});
			});

			it('responds with 400 when newPassword is over 100 characters', async () => {
				passport.use(new MockStrategy({ user: { id: 6 } }));

				const password = new Array(101).fill('a').join('');
				const data = { password: 'pass', newPassword: password };

				const res = await request(app).post('/auth/change-password').send(data);

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					_errors: [],
					newPassword: {
						_errors: ['String must contain at most 100 character(s)'],
					},
				});
			});
		});
	});
});
