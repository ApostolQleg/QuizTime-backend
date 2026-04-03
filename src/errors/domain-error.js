export class DomainError extends Error {
	constructor(message, statusCode = 500, errorCode = "INTERNAL_ERROR", details = undefined) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
		this.errorCode = errorCode;
		this.details = details;
	}
}
