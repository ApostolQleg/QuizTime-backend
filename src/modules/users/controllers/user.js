import * as userService from "#src/modules/users/services/user.js";

export const getCurrentUser = async (request, reply) => {
	const userId = request.userId;

	const data = await userService.getCurrentUser({ userId });
	return reply.send({ success: true, ...data });
};

export const getUserById = async (request, reply) => {
	const { id } = request.params;

	const data = await userService.getPublicUserById({ userId: id });
	return reply.send({ success: true, ...data });
};

export const changePassword = async (request, reply) => {
	const userId = request.userId;
	const { currentPassword, newPassword } = request.body;

	const data = await userService.changePassword({ userId, currentPassword, newPassword });
	return reply.send({ success: true, ...data });
};

export const updateProfile = async (request, reply) => {
	const userId = request.userId;
	const { nickname, themeColor, avatarType } = request.body;

	const data = await userService.updateProfile({ userId, nickname, themeColor, avatarType });
	return reply.send({ success: true, ...data });
};

export const deleteAccount = async (request, reply) => {
	const userId = request.userId;

	const data = await userService.deleteAccount({ userId });
	return reply.send({ success: true, ...data });
};

export const getNicknameSuggestions = async (_, reply) => {
	const data = await userService.getNicknameSuggestions();
	return reply.send({ success: true, ...data });
};
