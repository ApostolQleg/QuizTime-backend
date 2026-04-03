import * as securityService from "./security.js";
import * as googleService from "./google.js";
import * as userService from "./users.js";
import * as tempCodesService from "./temp-codes.js";

export const register = async ({ email, password, avatarUrl, code, googleToken }) => {
	if (!email || !password) {
		return {
			ok: false,
			errorType: "VALIDATION",
			error: "Email and password are required",
		};
	}

	const existingUser = await userService.findByEmail(email);
	if (existingUser) {
		return {
			ok: false,
			errorType: "CONFLICT",
			error: "User with this email already exists",
		};
	}

	let googleId = null;
	let finalAvatarUrl = avatarUrl;

	if (googleToken) {
		const googleProfile = await googleService.verifyAndNormalizeGoogleToken(googleToken);

		if (googleProfile.email !== email) {
			return {
				ok: false,
				errorType: "UNAUTHORIZED",
				error: "Google email does not match provided email",
			};
		}

		googleId = googleProfile.googleId;
		if (!finalAvatarUrl) finalAvatarUrl = googleProfile.picture;
	} else {
		if (!code) {
			return {
				ok: false,
				errorType: "VALIDATION",
				error: "Verification code is required",
			};
		}

		const verification = await tempCodesService.verifyCode(email, code);
		if (!verification.ok) return verification;
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
};

export const login = async ({ email, password }) => {
	const user = await userService.findByEmail(email);

	if (!user) {
		return { ok: false, errorType: "NOT_FOUND", error: "User not found" };
	}

	const isValidPassword = await securityService.verifyPassword(password, user.passwordHash);
	if (!isValidPassword) {
		return { ok: false, errorType: "UNAUTHORIZED", error: "Invalid password" };
	}

	const token = securityService.signAccessToken(user._id);
	return { ok: true, user: userService.sanitizeUser(user), token };
};

export const sendCode = async ({ email }) => {
	if (!email) {
		return { ok: false, errorType: "VALIDATION", error: "Email is required" };
	}

	const existingUser = await userService.findByEmail(email);
	if (existingUser) {
		return {
			ok: false,
			errorType: "CONFLICT",
			error: "User with this email already exists",
		};
	}

	await tempCodesService.issueForEmail(email);
	return { ok: true, message: "Code sent" };
};

export const googleAuth = async ({ token }) => {
	const googleProfile = await googleService.verifyAndNormalizeGoogleToken(token);
	const { email, googleId, picture } = googleProfile;

	let user = await userService.findByEmail(email);
	if (!user) {
		user = await userService.createGoogleUser({ email, picture, googleId });
	} else {
		user = await userService.ensureGoogleFields(user, { googleId, picture });
	}

	const appToken = securityService.signAccessToken(user._id);
	return { ok: true, user: userService.sanitizeUser(user), token: appToken };
};

export const googleExtract = async ({ token }) => {
	const googleProfile = await googleService.verifyAndNormalizeGoogleToken(token);
	const existingUser = await userService.findByEmail(googleProfile.email);

	if (existingUser) {
		return {
			ok: false,
			errorType: "CONFLICT",
			error: "User with this email already exists",
		};
	}

	return {
		ok: true,
		email: googleProfile.email,
		picture: googleProfile.picture,
		googleId: googleProfile.googleId,
	};
};

export const linkGoogle = async ({ userId, token }) => {
	const googleProfile = await googleService.verifyAndNormalizeGoogleToken(token);

	const existingGoogleUser = await userService.findByGoogleId(googleProfile.googleId);
	if (existingGoogleUser && String(existingGoogleUser._id) !== String(userId)) {
		return {
			ok: false,
			errorType: "CONFLICT",
			error: "This Google account is already linked to another user",
		};
	}

	const user = await userService.findById(userId);
	if (!user) {
		return { ok: false, errorType: "NOT_FOUND", error: "User not found" };
	}

	await userService.linkGoogleAccount(user, {
		googleId: googleProfile.googleId,
		picture: googleProfile.picture,
	});

	return { ok: true, user: userService.sanitizeUser(user) };
};
