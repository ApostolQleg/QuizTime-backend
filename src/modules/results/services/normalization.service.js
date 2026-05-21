const toPlainObject = (value) => {
	if (!value) return null;
	return typeof value.toObject === "function" ? value.toObject() : { ...value };
};

export const normalizeResultListItem = (result) => {
	const data = toPlainObject(result);
	if (!data) return null;

	const quiz =
		data.quizInfo ||
		(data.quizId && typeof data.quizId === "object" && data.quizId._id != null
			? data.quizId
			: null);

	return {
		_id: data._id,
		quizId: quiz ? String(quiz._id) : data.quizId ? String(data.quizId) : null,
		quizTitle: quiz?.title || data.quizTitle || "Untitled Quiz",
		category: quiz?.category || data.category || "Other",
		tags: quiz?.tags || data.tags || [],
		summary: data.summary || {},
		userId: data.userId ? String(data.userId) : null,
	};
};

export const normalizeResultDetails = (result) => {
	const data = toPlainObject(result);
	if (!data) return null;

	const quiz =
		data.quizInfo ||
		(data.quizId && typeof data.quizId === "object" && data.quizId._id != null
			? data.quizId
			: null);

	return {
		_id: data._id,
		quizId: quiz ? String(quiz._id) : data.quizId ? String(data.quizId) : null,
		quizTitle: quiz?.title || data.quizTitle || "Untitled Quiz",
		category: quiz?.category || data.category || "Other",
		tags: quiz?.tags || data.tags || [],
		summary: data.summary || {},
		answers: data.answers || [],
		questions: quiz?.questions || data.questions || [],
		userId: data.userId ? String(data.userId) : null,
	};
};

export const normalizeResultList = (results = []) => {
	return results.map(normalizeResultListItem).filter(Boolean);
};

export const buildSaveResultPayload = ({ userId, quizId, summary, answers }) => ({
	quizId,
	summary,
	answers,
	userId,
});
