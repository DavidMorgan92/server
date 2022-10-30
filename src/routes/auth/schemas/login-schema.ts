import { z } from 'zod';

/** Zod schema for login endpoint input */
const LoginSchema = z.object({
	username: z.string().min(1).max(100),
	password: z.string().min(1).max(100),
});

export default LoginSchema;
