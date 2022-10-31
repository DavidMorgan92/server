import { register } from '../auth/schemas';

describe('register schema', () => {
	it('trims email input', () => {
		const input = {
			email: ' \tdave@gmail.com\r\n',
			password: 'pass',
			confirmPassword: 'pass',
			displayName: 'Dave',
		};

		const result = register.parse(input);

		expect(result.email).toEqual('dave@gmail.com');
	});

	it('trims displayName input', () => {
		const input = {
			email: 'dave@gmail.com',
			password: 'pass',
			confirmPassword: 'pass',
			displayName: ' \tDave\r\n',
		};

		const result = register.parse(input);

		expect(result.displayName).toEqual('Dave');
	});
});
