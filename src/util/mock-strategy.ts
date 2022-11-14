import { Strategy } from 'passport';

export interface MockStrategyOptions {
	name?: string;
	user?: any;
}

export type DoneCallback = (error?: Error, user?: any, info?: any) => void;

export type VerifyFunction = (user: any, done: DoneCallback) => void;

export class MockStrategy extends Strategy {
	private user: any;
	private verify?: VerifyFunction;

	constructor(options?: MockStrategyOptions, verify?: VerifyFunction) {
		options = options || {};

		super();
		this.name = options.name || 'mock';
		this.user = options.user;
		this.verify = verify;
	}

	public authenticate(): void {
		if (!this.verify) return this.success(this.user);

		const verified: DoneCallback = (error, user, info) => {
			if (error) return this.error(error);

			if (!user) return this.fail(info);

			this.success(user, info);
		}

		try {
			this.verify(this.user, verified);
		} catch (e) {
			return this.error(e);
		}
	}
}
