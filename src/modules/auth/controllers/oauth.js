import * as authService from "../services/auth.js";

const ERROR_STATUS_BY_TYPE = {
	VALIDATION: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	RATE_LIMIT: 429,
	INTERNAL: 500,
};

const resolveStatusCode = (data) => {
	if (data?.ok) return 200;
	if (data?.errorType && ERROR_STATUS_BY_TYPE[data.errorType]) {
		return ERROR_STATUS_BY_TYPE[data.errorType];
	}
	return 400;
};

const sendServiceResponse = (reply, data) => {
	reply.code(resolveStatusCode(data)).send(data);
};

export const googleAuth = async (request, reply) => {
	const { token } = request.body;
	const data = await authService.googleAuth({ token });
	return sendServiceResponse(reply, data);
};

export const googleExtract = async (request, reply) => {
	const { token } = request.body;
	const data = await authService.googleExtract({ token });
	return sendServiceResponse(reply, data);
};

export const linkGoogle = async (request, reply) => {
	const { token } = request.body;
	const data = await authService.linkGoogle({ userId: request.userId, token });
	return sendServiceResponse(reply, data);
};
