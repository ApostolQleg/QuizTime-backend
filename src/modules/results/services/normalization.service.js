const toPlainObject = (value) => {
	if (!value) return null;
	return typeof value.toObject === "function" ? value.toObject() : { ...value };
};

const normalizeId = (value) => {
	if (value == null) return null;
	return typeof value === "object" && value._id != null ? String(value._id) : String(value);
};

export const normalizeResultListItem = (result) => {
	const data = toPlainObject(result);
	if (!data) return null;

	return {
		_id: data._id,
		quizId: normalizeId(data.quizId),
		quizTitle: data.quizTitle,
		category: data.category,
		tags: data.tags || [],
		summary: data.summary || {},
		userId: normalizeId(data.userId),
	};
};

export const normalizeResultDetails = (result) => {
	const data = toPlainObject(result);
	if (!data) return null;

	return {
		_id: data._id,
		quizId: normalizeId(data.quizId),
		quizTitle: data.quizTitle,
		category: data.category,
		tags: data.tags || [],
		summary: data.summary || {},
		answers: data.answers || [],
		questions: data.questions || [],
		userId: normalizeId(data.userId),
	};
};

export const normalizeResultList = (results = []) => {
	return results.map(normalizeResultListItem).filter(Boolean);
};

export const buildSaveResultPayload = ({ userId, quizId, quiz, answers, summary }) => ({
	quizId: normalizeId(quizId),
	quizTitle: quiz.title,
	category: quiz.category,
	tags: quiz.tags || [],
	summary,
	answers,
	questions: quiz.questions,
	userId,
});
