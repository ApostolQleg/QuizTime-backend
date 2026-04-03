import User from "../../users/user.model.js";
import { generateNickname } from "../../../shared/utils/nicknameGen.js";
import { generateOAuthPasswordHash } from "./security.js";

const buildUniqueNickname = async () => {
	let candidate = generateNickname().next().value;
	let exists = await User.exists({ nickname: candidate });

	while (exists) {
		candidate = generateNickname().next().value;
		exists = await User.exists({ nickname: candidate });
	}

	return candidate;
};

export const findByEmail = async (email) => {
	return User.findOne({ email });
};

export const findByGoogleId = async (googleId) => {
	return User.findOne({ googleId });
};

export const findById = async (userId) => {
	return User.findById(userId);
};

export const createLocalUser = async ({ email, passwordHash, avatarUrl, googleId }) => {
	const user = new User({
		email,
		nickname: await buildUniqueNickname(),
		passwordHash,
		avatarUrl,
		googleId: googleId || null,
	});

	await user.save();
	return user;
};

export const createGoogleUser = async ({ email, picture, googleId }) => {
	const user = new User({
		email,
		nickname: await buildUniqueNickname(),
		passwordHash: await generateOAuthPasswordHash(),
		googleId,
		avatarUrl: picture,
		avatarType: picture ? "google" : "generated",
	});

	await user.save();
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
		await user.save();
	}

	return user;
};

export const linkGoogleAccount = async (user, { googleId, picture }) => {
	user.googleId = googleId;

	if (!user.avatarUrl && picture) {
		user.avatarUrl = picture;
		user.avatarType = "google";
	}

	await user.save();
	return user;
};

export const sanitizeUser = (user) => {
	const { passwordHash, ...userData } = user.toObject();
	return userData;
};
