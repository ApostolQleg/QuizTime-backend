import * as authService from "#src/modules/auth/services/auth.js";

export const register = async (request, reply) => {
	const { email, password, avatarUrl, code, googleToken } = request.body;
	const data = await authService.register({
		email,
		password,
		avatarUrl,
		code,
		googleToken,
	});
	return reply.send({ success: true, ...data });
};

export const login = async (request, reply) => {
	const { email, password } = request.body;
	const data = await authService.login({ email, password });
	return reply.send({ success: true, ...data });
};

export const sendCode = async (request, reply) => {
	const { email } = request.body;
	const data = await authService.sendCode({ email });
	return reply.send({ success: true, ...data });
};
