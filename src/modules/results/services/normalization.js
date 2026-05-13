const toPlainObject = (value) => {
	if (!value) return null;
	if (typeof value.toObject === "function") return value.toObject();
	return { ...value };
};

const normalizeDateValue = (value) => {
	if (value instanceof Date) return value.toISOString();
	return value;
};

const normalizeQuizIdValue = (value) => {
	if (value == null) return null;
	if (typeof value === "object" && value._id != null) {
		return String(value._id);
	}
	return String(value);
};

export const normalizeCreatedAt = (createdAt) => {
	if (createdAt == null) return undefined;
	if (createdAt instanceof Date) return createdAt;

	if (typeof createdAt === "string" && /^\d+$/.test(createdAt)) {
		return new Date(Number(createdAt));
	}

	return new Date(createdAt);
};

export const normalizeResultListItem = (result) => {
	const resultData = toPlainObject(result);
	if (!resultData) return null;
	const resultDto = { ...resultData };
	delete resultDto.id;

	return {
		...resultDto,
		quizId: normalizeQuizIdValue(resultData.quizId),
		createdAt: normalizeDateValue(resultData.createdAt),
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
		createdAt: normalizeDateValue(resultData.createdAt),
	};
};

export const buildSaveResultPayload = ({ userId, quizId, quiz, answers, summary, createdAt }) => {
	const normalizedCreatedAt = normalizeCreatedAt(createdAt);

	return {
		quizId: normalizeQuizIdValue(quizId),
		quizTitle: quiz.title,
		...(normalizedCreatedAt ? { createdAt: normalizedCreatedAt } : {}),
		category: quiz.category,
		tags: quiz.tags || [],
		summary,
		answers,
		questions: quiz.questions,
		userId,
	};
};
