import { DomainError } from "#src/errors/domain-error.js";

export class AuthValidationError extends DomainError {
	constructor(message, details) {
		super(message, 400, "AUTH_VALIDATION_ERROR", details);
	}
}

export class EmailAlreadyExistsError extends DomainError {
	constructor(message = "User with this email already exists") {
		super(message, 409, "EMAIL_ALREADY_EXISTS");
	}
}

export class VerificationCodeRequiredError extends AuthValidationError {
	constructor() {
		super("Verification code is required");
	}
}

export class VerificationCodeExpiredError extends DomainError {
	constructor() {
		super(
			"Verification code expired or not found. Please try again.",
			404,
			"VERIFICATION_CODE_EXPIRED",
		);
	}
}

export class InvalidVerificationCodeError extends AuthValidationError {
	constructor() {
		super("Invalid verification code");
	}
}

export class UserNotFoundError extends DomainError {
	constructor(message = "User not found") {
		super(message, 404, "USER_NOT_FOUND");
	}
}

export class InvalidPasswordError extends DomainError {
	constructor() {
		super("Invalid password", 401, "INVALID_PASSWORD");
	}
}

export class GoogleEmailMismatchError extends DomainError {
	constructor() {
		super("Google email does not match provided email", 401, "GOOGLE_EMAIL_MISMATCH");
	}
}

export class GoogleAccountAlreadyLinkedError extends DomainError {
	constructor() {
		super(
			"This Google account is already linked to another user",
			409,
			"GOOGLE_ACCOUNT_ALREADY_LINKED",
		);
	}
}

export class InvalidGoogleTokenError extends DomainError {
	constructor() {
		super("Invalid Google token", 401, "INVALID_GOOGLE_TOKEN");
	}
}
