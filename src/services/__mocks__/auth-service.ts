import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { VerifiedCallback } from 'passport-jwt';
import HttpException from '../../exceptions/http-exception';
import { TokenPair } from '../auth-service';

/** Mock backing store for users */
const users = [
	{
		id: 1,
		email: 'dave@verified.com',
		password: 'pass',
		displayName: 'Dave Verified',
		verified: true,
		deleted: false,
	},
	{
		id: 2,
		email: 'dave@unverified.com',
		password: 'pass',
		displayName: 'Dave Unverified',
		verified: false,
		deleted: false,
	},
	{
		id: 3,
		email: 'dave@deleted.com',
		password: 'pass',
		displayName: 'Dave Deleted',
		verified: true,
		deleted: true,
	},
	{
		id: 4,
		email: 'dave2@verified.com',
		password: 'pass',
		displayName: 'Dave Verified',
		verified: true,
		deleted: false,
	},
	{
		id: 5,
		email: 'dave2@unverified.com',
		password: 'pass',
		displayName: 'Dave Unverified',
		verified: false,
		deleted: false,
	},
	{
		id: 6,
		email: 'dave3@verified.com',
		password: 'pass',
		displayName: 'Dave Verified',
		verified: true,
		deleted: false,
	},
	{
		id: 7,
		email: 'dave2@deleted.com',
		password: 'pass',
		displayName: 'Dave Deleted',
		verified: true,
		deleted: true,
	},
	{
		id: 8,
		email: 'dave3@unverified.com',
		password: 'pass',
		displayName: 'Dave Unverified',
		verified: false,
		deleted: false,
	},
];

/** Mock backing store for refresh tokens */
const refreshTokens = [
	{
		id: 1,
		userId: 1,
		token: 'mock refresh token',
		expiresAt: new Date(new Date().getTime() + 600000),
	},
	{
		id: 2,
		userId: 1,
		token: 'expired refresh token',
		expiresAt: new Date(new Date().getTime() - 600000),
	},
	{
		id: 3,
		userId: -1,
		token: 'refresh token for wrong user',
		expiresAt: new Date(new Date().getTime() + 600000),
	},
];

/** Mock backing store for verification tokens */
const verificationTokens = [
	{
		userId: 2,
		token: 'mock verification token',
		expiresAt: new Date(new Date().getTime() + 600000),
	},
	{
		userId: 2,
		token: 'expired verification token',
		expiresAt: new Date(new Date().getTime() - 600000),
	},
	{
		userId: -1,
		token: 'verification token with bad user ID',
		expiresAt: new Date(new Date().getTime() + 600000),
	},
	{
		userId: 3,
		token: 'verification token for deleted user',
		expiresAt: new Date(new Date().getTime() + 600000),
	},
	{
		userId: 4,
		token: 'verification token for verified user',
		expiresAt: new Date(new Date().getTime() + 600000),
	},
];

/** Mock backing store for forgot password tokens */
const forgotPasswordTokens = [
	{
		userId: 4,
		token: 'mock forgot password token',
		expiresAt: new Date(new Date().getTime() + 600000),
	},
	{
		userId: 6,
		token: 'mock forgot password token 2',
		expiresAt: new Date(new Date().getTime() + 600000),
	},
	{
		userId: 6,
		token: 'expired forgot password token',
		expiresAt: new Date(new Date().getTime() - 600000),
	},
	{
		userId: -1,
		token: 'forgot password token with invalid user ID',
		expiresAt: new Date(new Date().getTime() + 600000),
	},
	{
		userId: 7,
		token: 'forgot password token with deleted user',
		expiresAt: new Date(new Date().getTime() + 600000),
	},
	{
		userId: 8,
		token: 'forgot password token with unverified user',
		expiresAt: new Date(new Date().getTime() + 600000),
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
 * Mock authentication middleware
 */
export function protectedRoute(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	return passport.authenticate('mock', { session: false })(req, res, next);
}

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
	// Find user in backing store
	const user = users.find(u => u.email === email);

	// Throw if email isn't matched
	if (user === undefined || user.deleted)
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
 * Mock loginWithRefreshToken method
 * @param email User's email
 * @param refreshToken Refresh token belonging to the user with the given email
 * @returns Mock access and refresh tokens
 */
export async function loginWithRefreshToken(
	email: string,
	refreshToken: string,
): Promise<TokenPair> {
	// Find user in backing store
	const user = users.find(u => u.email === email);

	// Throw if email isn't matched
	if (user === undefined || user.deleted)
		throw new HttpException(401, 'Could not find user with matching email');

	// Throw if user is unverified
	if (!user.verified) throw new HttpException(401, 'User not verified');

	// Get token object with matching token string
	const tokenObj = refreshTokens.find(r => r.token === refreshToken);

	// Throw if refresh token does not exist in the store
	if (tokenObj === undefined)
		throw new HttpException(401, 'Invalid refresh token');

	// Throw if refresh token does not belong to the user with the given email
	if (user.id !== tokenObj.userId)
		throw new HttpException(401, 'Refresh token does not belong to the user');

	// Throw if refresh token is expired
	if (tokenObj.expiresAt < new Date())
		throw new HttpException(401, 'Expired refresh token');

	// Delete the refresh token when it's used
	refreshTokens.splice(refreshTokens.indexOf(tokenObj), 1);

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
	if (user !== undefined && !user.deleted)
		throw new HttpException(500, 'Email is already registered');

	// Add new user to backing store
	users.push({
		id: newUserId++,
		email,
		password,
		displayName,
		verified: false,
		deleted: false,
	});
}

/**
 * Mock deleteAccount method
 * @param accountId ID of the account to delete
 */
export async function deleteAccount(accountId: number): Promise<void> {
	// Find user in backing store
	const user = users.find(u => u.id === accountId);

	// Throw if user is not found
	if (user === undefined || user.deleted)
		throw new HttpException(500, 'User does not exist');

	// Throw if user is unverified
	if (!user.verified) throw new HttpException(500, 'User not verified');

	// Delete user
	user.deleted = true;
}

/**
 * Verify an unverified account with a verification token
 * @param token Verification token belonging to the unverified account
 */
export async function verifyAccount(token: string): Promise<void> {
	// Find verification token in storage
	const verificationToken = verificationTokens.find(v => v.token === token);

	// Throw if verification token does not exist
	if (verificationToken === undefined)
		throw new HttpException(500, 'Invalid verification token');

	// Throw if verification token is expired
	if (verificationToken.expiresAt < new Date())
		throw new HttpException(500, 'Expired verification token');

	// Find user with account ID matching the verification token
	const user = users.find(u => u.id === verificationToken.userId);

	// Throw if user not found
	if (user === undefined || user.deleted)
		throw new HttpException(500, 'Failed to update user record');

	// Throw if user is already verified
	if (user.verified) throw new HttpException(500, 'User already verified');

	// Update user record
	user.verified = true;

	// Delete verification token
	verificationTokens.splice(verificationTokens.indexOf(verificationToken), 1);
}

/**
 * Mock resendVerification method
 * @param email Email address to resend verification token to
 */
export async function resendVerification(email: string): Promise<void> {
	// Find user in backing store
	const user = users.find(u => u.email === email);

	// Throw if email isn't matched
	if (user === undefined || user.deleted)
		throw new HttpException(500, 'Could not find user with matching email');

	// Throw if user is already verified
	if (user.verified) throw new HttpException(500, 'User already verified');

	// Send new verification token

	// Delete existing verification tokens
	while (true) {
		const index = verificationTokens.findIndex(v => v.userId === user.id);
		if (index < 0) break;
		verificationTokens.splice(index, 1);
	}
}

/**
 * Mock sendForgotPasswordToken method
 * @param email Email address to send forgot password token to
 */
export async function sendForgotPasswordToken(email: string): Promise<void> {
	// Find user in backing store
	const user = users.find(u => u.email === email);

	// Throw if email isn't matched
	if (user === undefined || user.deleted)
		throw new HttpException(500, 'Could not find user with matching email');

	// Throw if user is not verified
	if (!user.verified) throw new HttpException(500, 'User not verified');

	// Send new forgot password token

	// Delete existing forgot password tokens
	while (true) {
		const index = forgotPasswordTokens.findIndex(f => f.userId === user.id);
		if (index < 0) break;
		forgotPasswordTokens.splice(index, 1);
	}
}

/**
 * Set a new password for a user with a forgot password token
 * @param newPassword New password
 * @param token Forgot password token
 */
export async function resetPassword(
	newPassword: string,
	token: string,
): Promise<void> {
	// Find forgot password token in storage
	const forgotPasswordToken = forgotPasswordTokens.find(f => f.token === token);

	// Throw if forgot password token does not exist
	if (forgotPasswordToken === undefined)
		throw new HttpException(500, 'Invalid forgot password token');

	// Throw if forgot password token is expired
	if (forgotPasswordToken.expiresAt < new Date())
		throw new HttpException(500, 'Expired forgot password token');

	// Find user with account ID matching the forgot password token
	const user = users.find(u => u.id === forgotPasswordToken.userId);

	// Throw if user not found
	if (user === undefined || user.deleted)
		throw new HttpException(500, 'Failed to update user record');

	// Throw if user is not verified
	if (!user.verified) throw new HttpException(500, 'User not verified');

	// Update user record
	user.password = newPassword;

	// Delete forgot password token
	forgotPasswordTokens.splice(
		forgotPasswordTokens.indexOf(forgotPasswordToken),
		1,
	);
}
