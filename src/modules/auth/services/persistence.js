import { generateNickname } from "#src/shared/utils/nicknameGen.js";
import * as tempCodeService from "#src/modules/auth/services/temp-codes.js";
import * as userRepository from "#src/modules/auth/repositories/user.js";
import * as securityService from "#src/modules/auth/services/security.js";

const buildUniqueNickname = async () => {
	let candidate = generateNickname().next().value;
	let exists = await userRepository.existsByNickname(candidate);

	while (exists) {
		candidate = generateNickname().next().value;
		exists = await userRepository.existsByNickname(candidate);
	}

	return candidate;
};

export const findUserByEmail = async (email) => {
	return userRepository.findByEmail(email);
};

export const findUserByGoogleId = async (googleId) => {
	return userRepository.findByGoogleId(googleId);
};

export const findUserById = async (userId) => {
	return userRepository.findById(userId);
};

export const createLocalUser = async ({ email, passwordHash, avatarUrl, googleId }) => {
	return userRepository.create({
		email,
		nickname: await buildUniqueNickname(),
		passwordHash,
		avatarUrl,
		googleId: googleId || null,
	});
};

export const createGoogleUser = async ({ email, picture, googleId }) => {
	return userRepository.create({
		email,
		nickname: await buildUniqueNickname(),
		passwordHash: await securityService.generateOAuthPasswordHash(),
		googleId,
		avatarUrl: picture,
		avatarType: picture ? "google" : "generated",
	});
};

export const ensureGoogleFields = async ({ user, googleId, picture }) => {
	let hasChanges = false;

	if (!user.nickname) {
		user.nickname = await buildUniqueNickname();
		hasChanges = true;
	}

	if (!user.googleId) {
		user.googleId = googleId;
		hasChanges = true;
	}

	if (!user.avatarUrl && picture) {
		user.avatarUrl = picture;
		user.avatarType = "google";
		hasChanges = true;
	}

	if (hasChanges) {
		await userRepository.save(user);
	}

	return user;
};

export const linkGoogleAccount = async ({ user, googleId, picture }) => {
	user.googleId = googleId;

	if (!user.avatarUrl && picture) {
		user.avatarUrl = picture;
		user.avatarType = "google";
	}

	await userRepository.save(user);
	return user;
};

export const verifyCode = async ({ email, code }) => {
	return tempCodeService.verifyCode(email, code);
};

export const issueCode = async ({ email }) => {
	return tempCodeService.issueForEmail(email);
};
