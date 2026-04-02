import * as services from "./auth.services.js";

export const register = async (request, reply) => {
	const { email, password, avatarUrl, code, googleToken } = request.body;
	const data = await services.register(email, password, avatarUrl, code, googleToken);
	reply.code(data.code || (data.ok ? 200 : 400)).send(data);
};

export const login = async (request, reply) => {
	const { email, password } = request.body;
	const data = await services.login(email, password);
	reply.code(data.code || (data.ok ? 200 : 400)).send(data);
};

export const googleAuth = async (request, reply) => {
	const { token } = request.body;
	const data = await services.googleAuth(token);
	reply.code(data.code || (data.ok ? 200 : 400)).send(data);
};

export const googleExtract = async (request, reply) => {
	const { token } = request.body;
	const data = await services.googleExtract(token);
	reply.code(data.code || (data.ok ? 200 : 400)).send(data);
};

export const sendCode = async (request, reply) => {
	const { email } = request.body;
	const data = await services.sendCode(email);
	reply.code(data.code || (data.ok ? 200 : 400)).send(data);
};

export const linkGoogle = async (request, reply) => {
	const userId = request.userId;
	const { token } = request.body;
	const data = await services.linkGoogle(userId, token);
	reply.code(data.code || (data.ok ? 200 : 400)).send(data);
};
