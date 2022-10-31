import { z } from 'zod';

/** Zod schema for login endpoint input */
export const login = z.object({
	email: z.string().email().min(1).max(100),
	password: z.string().min(1).max(100),
});

/** Zod schema for register endpoint input */
export const register = z
	.object({
		email: z.string().trim().email().min(1).max(100),
		password: z.string().min(1).max(100),
		confirmPassword: z.string().min(1).max(100),
		displayName: z.string().trim().min(1).max(100),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});
