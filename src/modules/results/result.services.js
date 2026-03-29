import { Result } from "./index.js";
import { Quiz } from "../quizzes/index.js";

export const getResults = async (userId, limit, skip, searchParam, sortParam) => {
	const filter = {
		userId: userId,
	};

	let sortQuery = { createdAt: -1 };
	if (sortParam === "oldest") sortQuery = { createdAt: 1 };
	else if (sortParam === "az") sortQuery = { quizTitle: 1, createdAt: -1 };
	else if (sortParam === "za") sortQuery = { quizTitle: -1, createdAt: -1 };

	if (searchParam) {
		const escapedSearch = searchParam.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		filter.quizTitle = { $regex: escapedSearch, $options: "i" };
	}

	const results = await Result.find(filter)
		.select("-questions")
		.sort(sortQuery)
		.skip(skip)
		.limit(limit)
		.lean();

	return results;
};

export const saveResult = async (request, reply) => {
	try {
		const { quizId, answers, summary, timestamp } = request.body;
		if (!quizId || !answers || !summary || !timestamp) {
			return reply.code(400).send({ error: "Invalid payload" });
		}

		const normalizedTimestamp = new Date(timestamp);
		if (Number.isNaN(normalizedTimestamp.getTime())) {
			return reply.code(400).send({ error: "Invalid timestamp" });
		}

		const quiz = await Quiz.findOne({ id: String(quizId) }).lean();
		if (!quiz) return reply.code(404).send({ error: "Quiz not found" });

		const result = new Result({
			quizId,
			quizTitle: quiz.title,
			timestamp: normalizedTimestamp,
			summary,
			answers,
			questions: quiz.questions,
			userId: request.userId,
		});

		await result.save();
		reply.code(201).send({ ok: true, resultId: result._id });
	} catch (error) {
		console.error("Save result error:", error);
		reply.code(500).send({ error: "Failed to save result" });
	}
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
