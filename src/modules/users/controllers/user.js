import * as userService from "../services/user.js";

export const getUser = async (request, reply) => {
	const userId = request.userId;

	const data = await userService.getUserData({ userId });
	return reply.send({ success: true, ...data });
};

export const getUserById = async (request, reply) => {
	const { id } = request.params;

	const data = await userService.getUserDataById({ userId: id });
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

export const getNicknameArray = async (_, reply) => {
	const data = await userService.getNicknameArray();
	return reply.send({ success: true, ...data });
};
