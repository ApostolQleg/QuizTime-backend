import * as authService from "#src/modules/auth/services/auth.js";

export const googleAuth = async (request, reply) => {
	const { token } = request.body;
	const data = await authService.googleAuth({ token });
	return reply.send({ success: true, ...data });
};

export const googleExtract = async (request, reply) => {
	const { token } = request.body;
	const data = await authService.googleExtract({ token });
	return reply.send({ success: true, ...data });
};

export const linkGoogle = async (request, reply) => {
	const { token } = request.body;
	const data = await authService.linkGoogle({ userId: request.userId, token });
	return reply.send({ success: true, ...data });
};
