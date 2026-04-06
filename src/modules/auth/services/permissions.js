import {
	AuthValidationError,
	EmailAlreadyExistsError,
	GoogleAccountAlreadyLinkedError,
	GoogleEmailMismatchError,
	InvalidPasswordError,
	UserNotFoundError,
	VerificationCodeRequiredError,
} from "#src/modules/auth/errors/auth.js";

export const assertRegisterPayload = ({ email, password }) => {
	if (!email || !password) {
		throw new AuthValidationError("Email and password are required");
	}
};

export const assertSendCodePayload = ({ email }) => {
	if (!email) {
		throw new AuthValidationError("Email is required");
	}
};

export const assertEmailAvailable = (user) => {
	if (user) {
		throw new EmailAlreadyExistsError();
	}
};

export const assertGoogleEmailMatches = ({ expectedEmail, actualEmail }) => {
	if (expectedEmail !== actualEmail) {
		throw new GoogleEmailMismatchError();
	}
};

export const assertVerificationCodeProvided = (code) => {
	if (!code) {
		throw new VerificationCodeRequiredError();
	}
};

export const assertUserExists = (user) => {
	if (!user) {
		throw new UserNotFoundError();
	}
};

export const assertValidPassword = (isValid) => {
	if (!isValid) {
		throw new InvalidPasswordError();
	}
};

export const assertGoogleAccountCanBeLinked = ({ existingGoogleUser, userId }) => {
	if (existingGoogleUser && String(existingGoogleUser._id) !== String(userId)) {
		throw new GoogleAccountAlreadyLinkedError();
	}
};
