const toPlainObject = (value) => {
	if (!value) return null;
	return typeof value.toObject === "function" ? value.toObject() : { ...value };
};

export const normalizeResultListItem = (result) => {
	const data = toPlainObject(result);
	if (!data) return null;

	const isPopulated = data.quizId && typeof data.quizId === "object";
	const quiz = isPopulated ? data.quizId : {};

	return {
		_id: data._id,
		quizId: isPopulated ? String(quiz._id) : String(data.quizId),
		quizTitle: quiz.title || data.quizTitle || "Untitled Quiz",
		category: quiz.category || data.category || "Other",
		tags: quiz.tags || data.tags || [],
		summary: data.summary || {},
		userId: data.userId ? String(data.userId) : null,
	};
};

export const normalizeResultDetails = (result) => {
	const data = toPlainObject(result);
	if (!data) return null;

	const isPopulated = data.quizId && typeof data.quizId === "object";
	const quiz = isPopulated ? data.quizId : {};

	return {
		_id: data._id,
		quizId: isPopulated ? String(quiz._id) : String(data.quizId),
		quizTitle: quiz.title || data.quizTitle || "Untitled Quiz",
		category: quiz.category || data.category || "Other",
		tags: quiz.tags || data.tags || [],
		summary: data.summary || {},
		answers: data.answers || [],
		questions: quiz.questions || data.questions || [],
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
