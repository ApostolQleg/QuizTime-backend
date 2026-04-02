import * as services from "./user.services.js";

export const getUser = async (request, reply) => {
	const id = request.userId;
	const data = await services.getUserData(id);
	reply.code(data.code || (data.ok ? 200 : 400)).send(data);
};

export const getUserById = async (request, reply) => {
	const id = request.params.id;
	const data = await services.getUserDataById(id);
	reply.code(data.code || (data.ok ? 200 : 400)).send(data);
};

export const changePassword = async (request, reply) => {
	const userId = request.userId;
	const { currentPassword, newPassword } = request.body;
	const data = await services.changePassword(userId, currentPassword, newPassword);
	reply.code(data.code || (data.ok ? 200 : 400)).send(data);
};

export const updateProfile = async (request, reply) => {
	const userId = request.userId;
	const { nickname, themeColor, avatarType } = request.body;
	const data = await services.updateProfile(userId, nickname, themeColor, avatarType);
	reply.code(data.code || (data.ok ? 200 : 400)).send(data);
};

export const deleteAccount = async (request, reply) => {
	const id = request.userId;
	const data = await services.deleteAccount(id);
	reply.code(data.code || (data.ok ? 200 : 400)).send(data);
};

export const getNicknameArray = async (_, reply) => {
	const data = await services.getNicknameArray();
	reply.code(data.code || (data.ok ? 200 : 400)).send(data);
};
