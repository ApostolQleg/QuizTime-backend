import * as securityService from "./security.js";
import * as googleAdapter from "./google-adapter.js";
import * as normalizationService from "./normalization.js";
import * as permissionService from "./permissions.js";
import * as persistenceService from "./persistence.js";

export const register = async ({ email, password, avatarUrl, code, googleToken }) => {
	permissionService.assertRegisterPayload({ email, password });

	const existingUser = await persistenceService.findUserByEmail(email);
	permissionService.assertEmailAvailable(existingUser);

	let googleProfile = null;

	if (googleToken) {
		googleProfile = await googleAdapter.getGoogleProfileOrThrow(googleToken);
		permissionService.assertGoogleEmailMatches({
			expectedEmail: email,
			actualEmail: googleProfile.email,
		});
	} else {
		permissionService.assertVerificationCodeProvided(code);
		await persistenceService.verifyCode({ email, code });
	}

	const { googleId, finalAvatarUrl } = normalizationService.resolveRegisterIdentity({
		avatarUrl,
		googleProfile,
	});

	const passwordHash = await securityService.hashPassword(password);
	const user = await persistenceService.createLocalUser({
		email,
		passwordHash,
		avatarUrl: finalAvatarUrl,
		googleId,
	});

	const token = securityService.signAccessToken(user._id);
	return { user: normalizationService.sanitizeUser(user), token };
};

export const login = async ({ email, password }) => {
	const user = await persistenceService.findUserByEmail(email);
	permissionService.assertUserExists(user);

	const isValidPassword = await securityService.verifyPassword(password, user.passwordHash);
	permissionService.assertValidPassword(isValidPassword);

	const token = securityService.signAccessToken(user._id);
	return { user: normalizationService.sanitizeUser(user), token };
};

export const sendCode = async ({ email }) => {
	permissionService.assertSendCodePayload({ email });

	const existingUser = await persistenceService.findUserByEmail(email);
	permissionService.assertEmailAvailable(existingUser);

	await persistenceService.issueCode({ email });
	return { message: "Code sent" };
};

export const googleAuth = async ({ token }) => {
	const googleProfile = await googleAdapter.getGoogleProfileOrThrow(token);
	const { email, googleId, picture } = googleProfile;

	let user = await persistenceService.findUserByEmail(email);
	if (!user) {
		user = await persistenceService.createGoogleUser({ email, picture, googleId });
	} else {
		user = await persistenceService.ensureGoogleFields({ user, googleId, picture });
	}

	const appToken = securityService.signAccessToken(user._id);
	return { user: normalizationService.sanitizeUser(user), token: appToken };
};

export const googleExtract = async ({ token }) => {
	const googleProfile = await googleAdapter.getGoogleProfileOrThrow(token);
	const existingUser = await persistenceService.findUserByEmail(googleProfile.email);
	permissionService.assertEmailAvailable(existingUser);

	return normalizationService.buildGoogleExtractPayload(googleProfile);
};

export const linkGoogle = async ({ userId, token }) => {
	const googleProfile = await googleAdapter.getGoogleProfileOrThrow(token);

	const existingGoogleUser = await persistenceService.findUserByGoogleId(googleProfile.googleId);
	permissionService.assertGoogleAccountCanBeLinked({
		existingGoogleUser,
		userId,
	});

	const user = await persistenceService.findUserById(userId);
	permissionService.assertUserExists(user);

	await persistenceService.linkGoogleAccount({
		user,
		googleId: googleProfile.googleId,
		picture: googleProfile.picture,
	});

	return { user: normalizationService.sanitizeUser(user) };
};
