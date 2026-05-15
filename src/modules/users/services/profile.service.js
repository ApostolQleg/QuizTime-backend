import { InvalidUserPayloadError, UserNotFoundError } from "../errors/user.error.js";
import * as userRepository from "../repositories/user.repository.js";

const sanitizeUser = (user) => {
	const { passwordHash, ...userData } = user.toObject();
	return userData;
};

export const getCurrentUserProfile = async ({ userId }) => {
	const user = await userRepository.findUserById(userId);
	if (!user) {
		throw new UserNotFoundError();
	}

	return {
		user: {
			_id: user._id,
			email: user.email,
			nickname: user.nickname,
			avatarUrl: user.avatarUrl,
			themeColor: user.themeColor,
			avatarType: user.avatarType,
			googleId: user.googleId,
		},
	};
};

export const getPublicUserProfile = async ({ userId }) => {
	const user = await userRepository.findPublicUserById(userId);
	if (!user) {
		throw new UserNotFoundError();
	}

	return {
		user: {
			nickname: user.nickname,
			avatarUrl: user.avatarUrl,
			themeColor: user.themeColor,
			avatarType: user.avatarType,
		},
	};
};

export const updateProfile = async ({ userId, nickname, themeColor, avatarType }) => {
	if (nickname === undefined && themeColor === undefined && avatarType === undefined) {
		throw new InvalidUserPayloadError();
	}

	const updates = {};
	if (nickname !== undefined) updates.nickname = nickname;
	if (themeColor !== undefined) updates.themeColor = themeColor;
	if (avatarType !== undefined) updates.avatarType = avatarType;

	const user = await userRepository.updateUserById(userId, updates);
	if (!user) {
		throw new UserNotFoundError();
	}

	return { user: sanitizeUser(user) };
};
