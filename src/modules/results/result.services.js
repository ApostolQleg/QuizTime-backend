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

	return { ok: true, results };
};

export const saveResult = async (userId, quizId, answers, summary, timestamp) => {
	if (!quizId || !answers || !summary || !timestamp)
		return { ok: false, error: "Invalid payload" };

	const normalizedTimestamp = new Date(timestamp);
	if (Number.isNaN(normalizedTimestamp.getTime()))
		return { ok: false, error: "Invalid timestamp" };

	const quiz = await Quiz.findOne({ id: String(quizId) }).lean();
	if (!quiz) return { ok: false, error: "Quiz not found" };

	const result = new Result({
		quizId: quizId,
		quizTitle: quiz.title,
		timestamp: normalizedTimestamp,
		summary: summary,
		answers: answers,
		questions: quiz.questions,
		userId: userId,
	});

	await result.save();

	return { ok: true, resultId: result._id };
};

export const getResultById = async (id, userId) => {
	const result = await Result.findOne({
		_id: id,
		userId: userId,
	}).lean();
	if (!result) return { ok: false, error: "Result not found" };

	return { ok: true, result };
};
