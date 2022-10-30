export async function login(_username: string, _password: string) {
	return {
		accessToken: {
			token: 'real access token',
			expiresAt: new Date(),
		},
		refreshToken: {
			token: 'real refresh token',
			expiresAt: new Date(),
		},
	};
}
