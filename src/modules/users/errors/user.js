import { DomainError } from "#src/errors/domain-error.js";

export class UserValidationError extends DomainError {
	constructor(message, details) {
		super(message, 400, "USER_VALIDATION_ERROR", details);
	}
}

export class InvalidUserPayloadError extends UserValidationError {
	constructor() {
		super("Invalid payload");
	}
}

export class UserNotFoundError extends DomainError {
	constructor(message = "User not found") {
		super(message, 404, "USER_NOT_FOUND");
	}
}

export class CurrentPasswordIncorrectError extends DomainError {
	constructor(message = "Current password is incorrect") {
		super(message, 401, "CURRENT_PASSWORD_INCORRECT");
	}
}
