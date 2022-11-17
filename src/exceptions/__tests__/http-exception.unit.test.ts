import HttpException from '../http-exception';

describe('HttpException', () => {
	describe('constructor', () => {
		it('defaults to 500 and empty message', () => {
			const exception = new HttpException();
			expect(exception.status).toBe(500);
			expect(exception.message).toEqual('');
		});

		it('defaults to empty message if only status is given', () => {
			const exception = new HttpException(123);
			expect(exception.status).toBe(123);
			expect(exception.message).toEqual('');
		});

		it('stores status and message if both are given', () => {
			const exception = new HttpException(123, 'my status');
			expect(exception.status).toBe(123);
			expect(exception.message).toEqual('my status');
		});
	});
});

