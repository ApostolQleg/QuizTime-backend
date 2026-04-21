const toAuthorDto = (author) => {
	const normalizedAuthor = author || {};

	return {
		authorId: normalizedAuthor._id || null,
		authorName: normalizedAuthor.nickname,
		authorAvatarUrl: normalizedAuthor.avatarUrl,
		authorAvatarType: normalizedAuthor.avatarType,
		authorThemeColor: normalizedAuthor.themeColor,
	};
};

export const normalizeQuizListItem = (quiz) => {
	if (!quiz) return null;

	return {
		_id: quiz._id,
		id: quiz.id,
		title: quiz.title,
		category: quiz.category,
		tags: quiz.tags,
		description: quiz.description,
		questionsCount: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
		...toAuthorDto(quiz.authorId),
	};
};

export const normalizeQuizList = (quizzes = []) => {
	return quizzes.map(normalizeQuizListItem).filter(Boolean);
};

export const normalizeQuizDetails = (quiz) => {
	if (!quiz) return null;

	const quizData = quiz.toObject();
	if (!quizData.authorId && typeof quizData.authorId !== "object") {
		return quizData;
	}

	return {
		...quizData,
		...toAuthorDto(quizData.authorId),
	};
};

export const buildCreatePayload = ({
	id,
	title,
	category,
	tags,
	description,
	questions,
	userId,
	user,
}) => {
	return {
		id: String(id),
		title: title?.trim(),
		category: category?.trim(),
		tags: tags,
		description: description?.trim() || "",
		questions,
		authorId: userId,
		authorName: user.nickname,
	};
};

export const buildQuizUpdates = ({ title, description, questions }) => {
	const updates = {};

	if (typeof title === "string" && title.trim()) updates.title = title.trim();
	if (typeof description === "string") updates.description = description.trim();
	if (questions !== undefined) updates.questions = questions;

	return updates;
};
