import * as cleanupService from "./cleanup.service.js";
import * as nicknameService from "./nickname.service.js";
import * as profileService from "./profile.service.js";
import * as securityService from "./security.service.js";

export const getCurrentUser = async ({ userId }) => {
	return profileService.getCurrentUserProfile({ userId });
};

export const getPublicUserById = async ({ userId }) => {
	return profileService.getPublicUserProfile({ userId });
};

export const changePassword = async ({ userId, currentPassword, newPassword }) => {
	return securityService.changePassword({
		userId,
		currentPassword,
		newPassword,
	});
};

export const updateProfile = async ({ userId, nickname, themeColor, avatarType }) => {
	return profileService.updateProfile({
		userId,
		nickname,
		themeColor,
		avatarType,
	});
};

export const deleteAccount = async ({ userId }) => {
	return cleanupService.deleteAccount({ userId });
};

export const getNicknameSuggestions = async () => {
	return nicknameService.buildNicknameArray();
};
