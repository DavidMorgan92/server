import { VerifiedCallback } from 'passport-jwt';
import HttpException from '../../exceptions/http-exception';
import { TokenPair } from '../auth-service';

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

/** ID for a new user */
let newUserId = users.length + 1;

/**
 * Mock passport verify method
 */
export async function verifyJwt(
	_payload: any,
	_done: VerifiedCallback,
): Promise<void> {}

/**
 * Mock login method
 * @param email User's email
 * @param password User's password
 * @returns Mock access and refresh tokens
 */
export async function login(
	email: string,
	password: string,
): Promise<TokenPair> {
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

/**
 * Mock register method
 * @param email User's email
 * @param password User's password
 * @param displayName User's display name
 */
export async function register(
	email: string,
	password: string,
	displayName: string,
): Promise<void> {
	// Check for existing user in backing store
	const user = users.find(u => u.email === email);

	// Throw if email is taken
	if (user !== undefined)
		throw new HttpException(500, 'Email is already registered');

	// Add new user to backing store
	users.push({
		id: newUserId++,
		email,
		password,
		displayName,
		verified: false,
	});
}
