/**
 * Represents an error that will be reported to the API user
 */
export default class HttpException {
	/** HTTP status code */
	status: number;

	/** Message to give to the API caller */
	message: string;

	/**
	 * Construct with optional HTTP status code and message
	 * @param status HTTP status code
	 * @param message Message to give to the API caller
	 */
	constructor(status: number = 500, message: string = '') {
		this.status = status;
		this.message = message;
	}
}
