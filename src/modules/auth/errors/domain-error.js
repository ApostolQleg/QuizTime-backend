export class DomainError extends Error {
	constructor(message, { type = "INTERNAL", statusCode = 500, details } = {}) {
		super(message);
		this.name = this.constructor.name;
		this.type = type;
		this.statusCode = statusCode;
		this.details = details;
	}
}

export const toErrorResponse = (error) => {
	if (error instanceof DomainError) {
		return {
			ok: false,
			errorType: error.type,
			error: error.message,
			details: error.details,
		};
	}

	return {
		ok: false,
		errorType: "INTERNAL",
		error: "Unexpected internal error",
	};
};
