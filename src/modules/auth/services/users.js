import * as userRepository from "#src/modules/auth/repositories/user.js";
import { generateNickname } from "#src/shared/utils/nicknameGen.js";
import { generateOAuthPasswordHash } from "#src/modules/auth/services/security.js";

const buildUniqueNickname = async () => {
	let candidate = generateNickname().next().value;
	let exists = await userRepository.existsByNickname(candidate);

	while (exists) {
		candidate = generateNickname().next().value;
		exists = await userRepository.existsByNickname(candidate);
	}

	return candidate;
};

export const findByEmail = async (email) => {
	return userRepository.findByEmail(email);
};

export const findByGoogleId = async (googleId) => {
	return userRepository.findByGoogleId(googleId);
};

export const findById = async (userId) => {
	return userRepository.findById(userId);
};

export const createLocalUser = async ({ email, passwordHash, avatarUrl, googleId }) => {
	const user = await userRepository.create({
		email,
		nickname: await buildUniqueNickname(),
		passwordHash,
		avatarUrl,
		googleId: googleId || null,
	});
	return user;
};

export const createGoogleUser = async ({ email, picture, googleId }) => {
	const user = await userRepository.create({
		email,
		nickname: await buildUniqueNickname(),
		passwordHash: await generateOAuthPasswordHash(),
		googleId,
		avatarUrl: picture,
		avatarType: picture ? "google" : "generated",
	});
	return user;
};

export const ensureGoogleFields = async (user, { googleId, picture }) => {
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

export const linkGoogleAccount = async (user, { googleId, picture }) => {
	user.googleId = googleId;

	if (!user.avatarUrl && picture) {
		user.avatarUrl = picture;
		user.avatarType = "google";
	}

	await userRepository.save(user);
	return user;
};

export const sanitizeUser = (user) => {
	const { passwordHash, ...userData } = user.toObject();
	return userData;
};
