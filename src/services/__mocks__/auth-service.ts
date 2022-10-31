import { VerifiedCallback } from 'passport-jwt';
import HttpException from '../../exceptions/http-exception';

/** Mock backing store */
const users = [
	{
		id: 1,
		email: 'dave@verified.com',
		password: 'pass',
		displayName: 'Dave Verified',
		verified: true,
	},
	{
		id: 2,
		email: 'dave@unverified.com',
		password: 'pass',
		displayName: 'Dave Unverified',
		verified: false,
	},
];

/**
 * Mock passport verify method
 */
export async function verifyJwt(_payload: any, _done: VerifiedCallback) {}

/**
 * Mock login method
 * @param email User's email
 * @param password User's password
 * @returns Mock access and refresh tokens
 */
export async function login(email: string, password: string) {
	// Find user is backing store
	const user = users.find(u => u.email === email);

	// Throw if email isn't matched
	if (user === undefined)
		throw new HttpException(401, 'Could not find user with matching email');

	// Throw if user is unverified
	if (!user.verified) throw new HttpException(401, 'User not verified');

	// Throw if password is incorrect
	if (user.password !== password)
		throw new HttpException(401, 'Incorrect password');

	// Return access and refresh tokens
	return {
		accessToken: {
			token: 'mock access token',
			expiresAt: new Date(),
		},
		refreshToken: {
			token: 'mock refresh token',
			expiresAt: new Date(),
		},
	};
}
