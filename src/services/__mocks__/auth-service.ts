export async function login(_username: string, _password: string) {
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
