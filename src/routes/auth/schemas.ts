import { z } from 'zod';

/** Validation schema for login endpoint input */
export const login = z.object({
	email: z.string(),
	password: z.string(),
});

/** Validation schema for token endpoint input */
export const token = z.object({
	email: z.string(),
	refreshToken: z.string(),
});

/** Validation schema for register endpoint input */
export const register = z.object({
	email: z.string().trim().email().min(1).max(100),
	// TODO: Improve password validation
	password: z.string().min(1).max(100),
	displayName: z.string().trim().min(1).max(100),
});

/** Validation schema for verify endpoint input */
export const verify = z.object({
	token: z.string(),
});

/** Validation schema for resend-verification endpoint input */
export const resendVerification = z.object({
	email: z.string(),
});
