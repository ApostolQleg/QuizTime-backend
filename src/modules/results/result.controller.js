import * as services from "./result.services.js";

export const getUserResults = async (request, reply) => {
	const userId = request.userId;
	const limit = parseInt(request.query.limit) || 36;
	const skip = parseInt(request.query.skip) || 0;
	const search = request.query.search || "";
	const sort = request.query.sort || "newest";

	const data = await services.getResults(userId, limit, skip, search, sort);
	reply.code(data.code || (data.ok ? 200 : 400)).send(data);
};

export const saveResult = async (request, reply) => {
	const userId = request.userId;
	const { quizId, answers, summary, timestamp } = request.body;
	const data = await services.saveResult(userId, quizId, answers, summary, timestamp);
	reply.code(data.code || (data.ok ? 200 : 400)).send(data);
};

export const getResultById = async (request, reply) => {
	const id = request.params.id;
	const userId = request.userId;
	const data = await services.getResultById(id, userId);
	reply.code(data.code || (data.ok ? 200 : 400)).send(data);
};
