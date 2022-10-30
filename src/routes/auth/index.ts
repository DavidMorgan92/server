import express from 'express';
import { default as asyncHandler } from 'express-async-handler';
import LoginSchema from './schemas/login-schema';
import * as authService from '../../services/auth-service';

const auth = express.Router();

/** Get access and refresh tokens with login credentials */
auth.post(
	'/login',
	asyncHandler(async (req, res) => {
		const data = LoginSchema.parse(req.body);
		const result = await authService.login(data.username, data.password);
		res.json(result);
	}),
);

/** Get new access and refresh tokens with a refresh token */
auth.post('/token', (_req, _res) => {});

/** Register a new account */
auth.post('/register', (_req, _res) => {});

/** Delete an account */
auth.post('/delete', (_req, _res) => {});

/** Verify an account with a verification token */
auth.get('/verify', (_req, _res) => {});

/** Resend a verification token */
auth.post('/resend-verification', (_req, _res) => {});

/** Send a forgot password token */
auth.post('/forgot-password', (_req, _res) => {});

/** Reset password with a forgot password token */
auth.post('/reset-password', (_req, _res) => {});

/** Change password */
auth.post('/change-password', (_req, _res) => {});

export default auth;
