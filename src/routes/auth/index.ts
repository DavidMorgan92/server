import express from 'express';
import { default as asyncHandler } from 'express-async-handler';
import * as schemas from './schemas';
import * as authService from '../../services/auth-service';

const auth = express.Router();

/** Get access and refresh tokens with login credentials */
auth.post(
	'/login',
	asyncHandler(async (req, res) => {
		const data = schemas.login.parse(req.body);
		const result = await authService.login(data.email, data.password);
		res.json(result);
	}),
);

/** Get new access and refresh tokens with a refresh token */
auth.post(
	'/token',
	asyncHandler(async (req, res) => {
		const data = schemas.token.parse(req.body);
		const result = await authService.loginWithRefreshToken(
			data.email,
			data.refreshToken,
		);
		res.json(result);
	}),
);

/** Register a new account */
auth.post(
	'/register',
	asyncHandler(async (req, res) => {
		const data = schemas.register.parse(req.body);
		const result = await authService.register(
			data.email,
			data.password,
			data.displayName,
		);
		res.json(result);
	}),
);

/** Delete an account */
auth.post(
	'/delete',
	authService.protectedRoute,
	asyncHandler(async (req, res) => {
		const id = req.user?.id;

		// Return 401 Unauthorized status if user ID is undefined
		if (id === undefined) {
			res.sendStatus(401);
			return;
		}

		await authService.deleteAccount(id);
		res.sendStatus(200);
	}),
);

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
