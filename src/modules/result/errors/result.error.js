import { DomainError } from "#src/errors/domain-error.js";

export class ResultValidationError extends DomainError {
	constructor(message, details) {
		super(message, 400, "RESULT_VALIDATION_ERROR", details);
	}
}

export class InvalidResultPayloadError extends ResultValidationError {
	constructor() {
		super("Invalid payload");
	}
}

export class QuizNotFoundError extends DomainError {
	constructor(message = "Quiz not found") {
		super(message, 404, "QUIZ_NOT_FOUND");
	}
}

export class ResultNotFoundError extends DomainError {
	constructor(message = "Result not found") {
		super(message, 404, "RESULT_NOT_FOUND");
	}
}

export class ResultForbiddenError extends DomainError {
	constructor(message = "Forbidden") {
		super(message, 403, "RESULT_FORBIDDEN");
	}
}
