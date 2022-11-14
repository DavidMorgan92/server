import { Strategy } from 'passport';

/** Options for the mock strategy */
export interface MockStrategyOptions {
	/** Name of the mock strategy ('mock' if none is given) */
	name?: string;

	/** User object to attach to requests */
	user?: Express.User;
}

/** Callback for verify function to call to indicate verification status */
export type DoneCallback = (error?: Error, user?: Express.User, info?: any) => void;

/** Function called by MockStrategy to verify the user */
export type VerifyFunction = (user: Express.User, done: DoneCallback) => void;

/**
 * Mock passport strategy for testing
 */
export class MockStrategy extends Strategy {
	/** User to attach to requests */
	private user?: Express.User;

	/** Function to call to verify the user */
	private verify?: VerifyFunction;

	/**
	 * This strategy calls the verify method with the given user
	 * @param options Strategy options
	 * @param verify Verify function called to authenticate user
	 */
	constructor(options?: MockStrategyOptions, verify?: VerifyFunction) {
		options = options || {};

		super();
		this.name = options.name || 'mock';
		this.user = options.user;
		this.verify = verify;
	}

	/**
	 * Override strategy authenticate method
	 */
	public authenticate(): void {
		// Make no success or failure decision if user is undefined
		if (this.user === undefined) return this.pass();

		// Successful authentication if no verify method is given
		if (!this.verify) return this.success(this.user);

		// Callback for verify method to call
		const verified: DoneCallback = (error, user, info) => {
			// Authentication error if an error is given
			if (error) return this.error(error);

			// Authentication failure if user is falsy
			if (!user) return this.fail(info);

			// Successful authentication
			this.success(user, info);
		};

		try {
			this.verify(this.user, verified);
		} catch (error) {
			this.error(error);
		}
	}
}

