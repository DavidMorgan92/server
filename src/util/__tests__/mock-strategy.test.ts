import { DoneCallback, MockStrategy, VerifyFunction } from '../mock-strategy';

describe('MockStrategy', () => {
	describe('authenticate', () => {
		it('passes authentication if user is undefined', () => {
			const strategy = new MockStrategy();
			strategy.pass = jest.fn();
			strategy.authenticate();
			expect(strategy.pass).toHaveBeenCalled();
		});

		it('succeeds authentication if verify function is undefined', () => {
			const strategy = new MockStrategy({ user: { id: 1 } });
			strategy.success = jest.fn();
			strategy.authenticate();
			expect(strategy.success).toHaveBeenCalled();
		});

		it('calls error if an error is passed to the done callback', () => {
			const error = new Error();
			const verify: VerifyFunction = (_user, done) => done(error);
			const strategy = new MockStrategy({ user: { id: 1 } }, verify);
			strategy.error = jest.fn();
			strategy.authenticate();
			expect(strategy.error).toHaveBeenCalledWith(error);
		});

		it('fails authentication if undefined user is passed to done callback', () => {
			const info = {};
			const verify: VerifyFunction = (_user, done) =>
				done(undefined, undefined, info);
			const strategy = new MockStrategy({ user: { id: 1 } }, verify);
			strategy.fail = jest.fn();
			strategy.authenticate();
			expect(strategy.fail).toHaveBeenCalledWith(info);
		});

		it('succeeds authentication if user is passed to done callback', () => {
			const info = {};
			const user = { id: 1 };
			const verify: VerifyFunction = (_user, done) =>
				done(undefined, user, info);
			const strategy = new MockStrategy({ user }, verify);
			strategy.success = jest.fn();
			strategy.authenticate();
			expect(strategy.success).toHaveBeenCalledWith(user, info);
		});

		it('calls error if verify function throws', () => {
			const error = new Error();
			const verify: VerifyFunction = (_user, _done) => {
				throw error;
			};
			const strategy = new MockStrategy({ user: { id: 1 } }, verify);
			strategy.error = jest.fn();
			strategy.authenticate();
			expect(strategy.error).toHaveBeenCalledWith(error);
		});
	});
});

