import * as db from '../db';

const mockQuery = jest.fn();
const mockConnect = jest.fn();

jest.mock('pg', () => {
	return {
		Pool: class {
			query(query: string, params: any[]) {
				return mockQuery(query, params);
			}

			connect() {
				return mockConnect();
			}
		},
	};
});

describe('db', () => {
	describe('query', () => {
		it('calls Pool.query with the right values', async () => {
			const query = 'query string';
			const params = ['param1', 'param2'];

			await db.query(query, params);

			expect(mockQuery).toHaveBeenCalledWith(query, params);
		});

		it('calls Pool.connect', async () => {
			const query = 'query string';
			const params = ['param1', 'param2'];

			await db.getClient();

			expect(mockConnect).toHaveBeenCalled();
		});
	});
});

