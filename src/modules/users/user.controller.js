import * as services from "./user.services.js";

export const getUser = async (request, reply) => {
	const data = await services.getUserData(request.userId);
	if (!data.ok) return reply.code(404).send(data);
	return reply.send(data);
};

export const getUserById = async (request, reply) => {
	const data = await services.getUserDataById(request.params.id);
	if (!data.ok) return reply.code(404).send(data);
	return reply.send(data);
};

export const changePassword = async (request, reply) => {
	const userId = request.userId;
	const { currentPassword, newPassword } = request.body;

	const data = await services.changePassword(userId, currentPassword, newPassword);
	if (!data.ok) return reply.code(400).send(data);

	return reply.send(data);
};

export const updateProfile = async (request, reply) => {
	const userId = request.userId;
	const { nickname, themeColor, avatarType } = request.body;

	const data = await services.updateProfile(userId, nickname, themeColor, avatarType);
	if (!data.ok) return reply.code(400).send(data);

	return reply.send(data);
};

export const deleteAccount = async (request, reply) => {
	const data = await services.deleteAccount(request.userId);
	if (!data.ok) return reply.code(404).send(data);
	return reply.send(data);
};

export const getNicknameArray = async (_, reply) => {
	const data = await services.getNicknameArray();
	return reply.send(data);
};
