import HttpException from '../../exceptions/http-exception';

/** Mock backing store */
const users = [
	{
		id: 1,
		email: 'dave@verified.com',
		password: 'pass',
		displayName: 'Dave Verified',
		verified: true,
	},
	{
		id: 2,
		email: 'dave@unverified.com',
		password: 'pass',
		displayName: 'Dave Unverified',
		verified: false,
	},
];

export async function login(email: string, password: string) {
	const user = users.find(u => u.email === email);

	if (!user)
		throw new HttpException(401, 'Could not find user with matching email');

	if (!user.verified) throw new HttpException(401, 'User not verified');

	if (user.password !== password)
		throw new HttpException(401, 'Incorrect password');

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
