import express from 'express';

const auth = express.Router();

/** Get access and refresh tokens with login credentials */
auth.post('/login', (_req, _res) => {});

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
