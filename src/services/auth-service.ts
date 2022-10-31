import { VerifiedCallback } from 'passport-jwt';

export async function verifyJwt(_payload: any, _done: VerifiedCallback) {}

export async function login(_email: string, _password: string) {}

export async function register(
	_email: string,
	_password: string,
	_displayName: string,
) {}
