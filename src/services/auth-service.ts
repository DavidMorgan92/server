import { VerifiedCallback } from 'passport-jwt';

/** Represents a token string with an expiration date */
interface Token {
	/** The token */
	token: string;

	/** The expiration date/time of the token */
	expiresAt: Date;
}

/** Represents an access/refresh token pair for a verified user */
export interface TokenPair {
	/** The verified user's access token */
	accessToken: Token;

	/** The verified user's refresh token */
	refreshToken: Token;
}

export async function verifyJwt(
	_payload: any,
	_done: VerifiedCallback,
): Promise<void> {}

export async function login(
	_email: string,
	_password: string,
): Promise<TokenPair> {
	return {
		accessToken: { token: 'asdf', expiresAt: new Date() },
		refreshToken: { token: 'asdf', expiresAt: new Date() },
	};
}

export async function register(
	_email: string,
	_password: string,
	_displayName: string,
): Promise<void> {}
