const toPlainObject = (value) => {
	if (!value) return null;
	if (typeof value.toObject === "function") return value.toObject();
	return { ...value };
};

const normalizeDateValue = (value) => {
	if (value instanceof Date) return value.toISOString();
	return value;
};

export const normalizeTimestamp = (timestamp) => {
	if (timestamp == null) return new Date();
	if (timestamp instanceof Date) return timestamp;

	if (typeof timestamp === "string" && /^\d+$/.test(timestamp)) {
		return new Date(Number(timestamp));
	}

	return new Date(timestamp);
};

export const normalizeResultListItem = (result) => {
	const resultData = toPlainObject(result);
	if (!resultData) return null;

	return {
		...resultData,
		timestamp: normalizeDateValue(resultData.timestamp),
		createdAt: normalizeDateValue(resultData.createdAt),
	};
};

export const normalizeResultList = (results = []) => {
	return results.map(normalizeResultListItem).filter(Boolean);
};

export const normalizeResultDetails = (result) => {
	const resultData = toPlainObject(result);
	if (!resultData) return null;

	return {
		...resultData,
		timestamp: normalizeDateValue(resultData.timestamp),
		createdAt: normalizeDateValue(resultData.createdAt),
	};
};

export const buildSaveResultPayload = ({ userId, quizId, quiz, answers, summary, timestamp }) => {
	return {
		quizId: String(quizId),
		quizTitle: quiz.title,
		timestamp: normalizeTimestamp(timestamp),
		summary,
		answers,
		questions: quiz.questions,
		userId,
	};
};
