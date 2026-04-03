import * as securityService from "./security.js";
import * as googleService from "./google.js";
import * as userService from "./users.js";
import * as tempCodesService from "./temp-codes.js";
import {
	AuthValidationError,
	EmailAlreadyExistsError,
	GoogleAccountAlreadyLinkedError,
	GoogleEmailMismatchError,
	InvalidGoogleTokenError,
	InvalidPasswordError,
	UserNotFoundError,
	VerificationCodeRequiredError,
} from "../errors/auth.js";
import { toErrorResponse } from "../errors/domain-error.js";

const withErrorBoundary = async (callback) => {
	try {
		return await callback();
	} catch (error) {
		return toErrorResponse(error);
	}
};

const getGoogleProfile = async (token) => {
	try {
		return await googleService.verifyAndNormalizeGoogleToken(token);
	} catch {
		throw new InvalidGoogleTokenError();
	}
};

export const register = async ({ email, password, avatarUrl, code, googleToken }) => {
	return withErrorBoundary(async () => {
		if (!email || !password) {
			throw new AuthValidationError("Email and password are required");
		}

		const existingUser = await userService.findByEmail(email);
		if (existingUser) {
			throw new EmailAlreadyExistsError();
		}

		let googleId = null;
		let finalAvatarUrl = avatarUrl;

		if (googleToken) {
			const googleProfile = await getGoogleProfile(googleToken);

			if (googleProfile.email !== email) {
				throw new GoogleEmailMismatchError();
			}

			googleId = googleProfile.googleId;
			if (!finalAvatarUrl) finalAvatarUrl = googleProfile.picture;
		} else {
			if (!code) {
				throw new VerificationCodeRequiredError();
			}

			await tempCodesService.verifyCode(email, code);
		}

		const passwordHash = await securityService.hashPassword(password);
		const user = await userService.createLocalUser({
			email,
			passwordHash,
			avatarUrl: finalAvatarUrl,
			googleId,
		});

		const token = securityService.signAccessToken(user._id);
		return { ok: true, user: userService.sanitizeUser(user), token };
	});
};

export const login = async ({ email, password }) => {
	return withErrorBoundary(async () => {
		const user = await userService.findByEmail(email);

		if (!user) {
			throw new UserNotFoundError();
		}

		const isValidPassword = await securityService.verifyPassword(password, user.passwordHash);
		if (!isValidPassword) {
			throw new InvalidPasswordError();
		}

		const token = securityService.signAccessToken(user._id);
		return { ok: true, user: userService.sanitizeUser(user), token };
	});
};

export const sendCode = async ({ email }) => {
	return withErrorBoundary(async () => {
		if (!email) {
			throw new AuthValidationError("Email is required");
		}

		const existingUser = await userService.findByEmail(email);
		if (existingUser) {
			throw new EmailAlreadyExistsError();
		}

		await tempCodesService.issueForEmail(email);
		return { ok: true, message: "Code sent" };
	});
};

export const googleAuth = async ({ token }) => {
	return withErrorBoundary(async () => {
		const googleProfile = await getGoogleProfile(token);
		const { email, googleId, picture } = googleProfile;

		let user = await userService.findByEmail(email);
		if (!user) {
			user = await userService.createGoogleUser({ email, picture, googleId });
		} else {
			user = await userService.ensureGoogleFields(user, { googleId, picture });
		}

		const appToken = securityService.signAccessToken(user._id);
		return { ok: true, user: userService.sanitizeUser(user), token: appToken };
	});
};

export const googleExtract = async ({ token }) => {
	return withErrorBoundary(async () => {
		const googleProfile = await getGoogleProfile(token);
		const existingUser = await userService.findByEmail(googleProfile.email);

		if (existingUser) {
			throw new EmailAlreadyExistsError();
		}

		return {
			ok: true,
			email: googleProfile.email,
			picture: googleProfile.picture,
			googleId: googleProfile.googleId,
		};
	});
};

export const linkGoogle = async ({ userId, token }) => {
	return withErrorBoundary(async () => {
		const googleProfile = await getGoogleProfile(token);

		const existingGoogleUser = await userService.findByGoogleId(googleProfile.googleId);
		if (existingGoogleUser && String(existingGoogleUser._id) !== String(userId)) {
			throw new GoogleAccountAlreadyLinkedError();
		}

		const user = await userService.findById(userId);
		if (!user) {
			throw new UserNotFoundError();
		}

		await userService.linkGoogleAccount(user, {
			googleId: googleProfile.googleId,
			picture: googleProfile.picture,
		});

		return { ok: true, user: userService.sanitizeUser(user) };
	});
};
