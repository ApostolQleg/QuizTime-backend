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

export const register = async (request, reply) => {
	const { email, password, avatarUrl, code, googleToken } = request.body;
	const data = await authService.register({ email, password, avatarUrl, code, googleToken });
	return sendServiceResponse(reply, data);
};

export const login = async (request, reply) => {
	const { email, password } = request.body;
	const data = await authService.login({ email, password });
	return sendServiceResponse(reply, data);
};

export const sendCode = async (request, reply) => {
	const { email } = request.body;
	const data = await authService.sendCode({ email });
	return sendServiceResponse(reply, data);
};
