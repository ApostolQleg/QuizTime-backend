import mongoose from "mongoose";

const toPlainObject = (value) => {
	if (!value) return null;
	return typeof value.toObject === "function" ? value.toObject() : { ...value };
};

const normalizeId = (value) => {
	if (value == null) return null;
	return typeof value === "object" && value._id != null ? String(value._id) : String(value);
};

const flattenAuthor = (authorValue) => {
	if (authorValue == null) return { authorId: null };

	if (typeof authorValue === "string" || authorValue instanceof mongoose.Types.ObjectId) {
		return { authorId: authorValue.toString() };
	}

	if (typeof authorValue === "object") {
		const author = toPlainObject(authorValue);
		return {
			authorId: normalizeId(author),
			...(author.nickname !== undefined && { authorName: author.nickname }),
			...(author.avatarUrl !== undefined && { authorAvatarUrl: author.avatarUrl }),
			...(author.avatarType !== undefined && { authorAvatarType: author.avatarType }),
			...(author.themeColor !== undefined && { authorThemeColor: author.themeColor }),
		};
	}

	return { authorId: String(authorValue) };
};

export const normalizeQuizListItem = (quiz) => {
	const data = toPlainObject(quiz);
	if (!data) return null;

	const authorData = flattenAuthor(data.authorId);

	return {
		_id: data._id,
		title: data.title,
		category: data.category,
		tags: data.tags || [],
		questionsCount: Array.isArray(data.questions) ? data.questions.length : 0,
		authorId: authorData.authorId,
		authorName: authorData.authorName || null,
	};
};

export const normalizeQuizDetails = (quiz) => {
	const data = toPlainObject(quiz);
	if (!data) return null;

	const quizDto = { ...data };
	delete quizDto.id;
	delete quizDto.authorId;

	return {
		...quizDto,
		...flattenAuthor(data.authorId),
	};
};

export const normalizeQuizList = (quizzes = []) => {
	return quizzes.map(normalizeQuizListItem).filter(Boolean);
};

export const buildCreatePayload = ({ title, category, tags, description, questions, userId }) => ({
	title: title?.trim(),
	category: category?.trim(),
	tags: tags || [],
	description: description?.trim() || "",
	questions,
	authorId: userId,
});

export const buildQuizUpdates = ({ title, category, tags, description, questions }) => {
	const updates = {};
	if (typeof title === "string" && title.trim()) updates.title = title.trim();
	if (typeof category === "string" && category.trim()) updates.category = category.trim();
	if (Array.isArray(tags)) updates.tags = tags;
	if (typeof description === "string") updates.description = description.trim();
	if (questions !== undefined) updates.questions = questions;
	return updates;
};
