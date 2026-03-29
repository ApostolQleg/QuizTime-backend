import { Result } from "./index.js";
import * as services from "./result.services.js";

export const getUserResults = async (request, reply) => {
	const userId = request.userId;
	if (!userId) {
		return reply.code(400).send({ ok: false, error: "User ID missing" });
	}

	const limit = parseInt(request.query.limit) || 36;
	const skip = parseInt(request.query.skip) || 0;
	const searchParam = request.query.search || "";
	const sortParam = request.query.sort || "newest";

	const data = await services.getResults(userId, limit, skip, searchParam, sortParam);

	reply.send(data);
};

export const saveResult = async (request, reply) => {
	const userId = request.userId;
	const { quizId, answers, summary, timestamp } = request.body;

	const data = await services.saveResult(userId, quizId, answers, summary, timestamp);
	if (!data.ok) return reply.code(400).send(data);

	reply.code(201).send(data);
};

export const getResultById = async (request, reply) => {
	try {
		const result = await Result.findOne({
			_id: request.params.id,
			userId: request.userId,
		}).lean();
		if (!result) return reply.code(404).send({ error: "Result not found" });
		reply.send(result);
	} catch (error) {
		console.error("Fetch result error:", error);
		reply.code(500).send({ error: "Failed to fetch result" });
	}
};
