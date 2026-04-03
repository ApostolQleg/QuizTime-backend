import { DomainError } from "./domain-error.js";

export class AuthValidationError extends DomainError {
	constructor(message, details) {
		super(message, { type: "VALIDATION", statusCode: 400, details });
	}
}

export class EmailAlreadyExistsError extends DomainError {
	constructor(message = "User with this email already exists") {
		super(message, { type: "CONFLICT", statusCode: 409 });
	}
}

export class VerificationCodeRequiredError extends AuthValidationError {
	constructor() {
		super("Verification code is required");
	}
}

export class VerificationCodeExpiredError extends DomainError {
	constructor() {
		super("Verification code expired or not found. Please try again.", {
			type: "NOT_FOUND",
			statusCode: 404,
		});
	}
}

export class InvalidVerificationCodeError extends AuthValidationError {
	constructor() {
		super("Invalid verification code");
	}
}

export class UserNotFoundError extends DomainError {
	constructor(message = "User not found") {
		super(message, { type: "NOT_FOUND", statusCode: 404 });
	}
}

export class InvalidPasswordError extends DomainError {
	constructor() {
		super("Invalid password", { type: "UNAUTHORIZED", statusCode: 401 });
	}
}

export class GoogleEmailMismatchError extends DomainError {
	constructor() {
		super("Google email does not match provided email", {
			type: "UNAUTHORIZED",
			statusCode: 401,
		});
	}
}

export class GoogleAccountAlreadyLinkedError extends DomainError {
	constructor() {
		super("This Google account is already linked to another user", {
			type: "CONFLICT",
			statusCode: 409,
		});
	}
}

export class InvalidGoogleTokenError extends DomainError {
	constructor() {
		super("Invalid Google token", { type: "UNAUTHORIZED", statusCode: 401 });
	}
}
