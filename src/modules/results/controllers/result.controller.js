import eventBus, { EVENTS } from "#src/shared/events/eventBus.js";
import * as resultService from "../services/result.service.js";

export const getAllResults = async (request, reply) => {
	const userId = request.userId;
	const limit = parseInt(request.query.limit, 10) || 36;
	const skip = parseInt(request.query.skip, 10) || 0;
	const search = request.query.search || "";
	const sort = request.query.sort || "newest";

	const data = await resultService.getAllResults({
		userId,
		limit,
		skip,
		search,
		sort,
	});
	return reply.send({ success: true, ...data });
};

export const getResultById = async (request, reply) => {
	const userId = request.userId;
	const { id } = request.params;

	const data = await resultService.getResultById({ id, userId });
	return reply.send({ success: true, ...data });
};

export const createResult = async (request, reply) => {
	const userId = request.userId;
	const { quizId, answers, summary } = request.body;

	const data = await resultService.createResult({
		userId,
		quizId,
		answers,
		summary,
	});

	eventBus.emit(EVENTS.QUIZ_COMPLETED, {
		userId: userId,
		score: summary.score,
	});

	return reply.code(201).send({ success: true, ...data });
};
