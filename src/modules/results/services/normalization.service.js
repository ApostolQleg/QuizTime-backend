const toPlainObject = (value) => {
	if (!value) return null;
	if (typeof value.toObject === "function") return value.toObject();
	return { ...value };
};

const normalizeQuizIdValue = (value) => {
	if (value == null) return null;
	if (typeof value === "object" && value._id != null) {
		return String(value._id);
	}
	return String(value);
};

export const normalizeResultListItem = (result) => {
	const resultData = toPlainObject(result);
	if (!resultData) return null;
	const resultDto = { ...resultData };
	delete resultDto.id;

	return {
		...resultDto,
		quizId: normalizeQuizIdValue(resultData.quizId),
	};
};

export const normalizeResultList = (results = []) => {
	return results.map(normalizeResultListItem).filter(Boolean);
};

export const normalizeResultDetails = (result) => {
	const resultData = toPlainObject(result);
	if (!resultData) return null;
	const resultDto = { ...resultData };
	delete resultDto.id;

	return {
		...resultDto,
		quizId: normalizeQuizIdValue(resultData.quizId),
	};
};

export const buildSaveResultPayload = ({ userId, quizId, quiz, answers, summary }) => {
	return {
		quizId: normalizeQuizIdValue(quizId),
		quizTitle: quiz.title,
		category: quiz.category,
		tags: quiz.tags || [],
		summary,
		answers,
		questions: quiz.questions,
		userId,
	};
};
