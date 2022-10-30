/**
 * Represents an error in validating API input
 */
export default class ValidationException {
	/** List of errors that will be reported to the API caller */
	errors: ValidationError[];

	/**
	 * Construct with optional array of ValidationErrors
	 * @param errors Array of ValidationErrors
	 */
	constructor(errors: ValidationError[] = []) {
		this.errors = errors;
	}

	/**
	 * Add an error message for a given field
	 * @param field Name of the input field with the error
	 * @param message Message to give to the API caller
	 */
	addError(field: string, message: string): void {
		// Find index of existing errors for this field
		const existingFieldIndex = this.errors.findIndex(e => e.field === field);

		// If an object for this field already exists
		if (existingFieldIndex > -1) {
			// Add the message to the errors list for the field
			this.errors[existingFieldIndex].errors.push(message);
			return;
		}

		// Create a new errors object for the field with the new message
		this.errors.push({ field, errors: [message] });
	}

	/**
	 * Determine if there are errors in this object
	 * @returns True if there are errors
	 */
	hasErrors(): boolean {
		return this.errors.length > 0;
	}
}

/**
 * Represents a list of error messages for an input field
 */
interface ValidationError {
	field: string;
	errors: string[];
}
