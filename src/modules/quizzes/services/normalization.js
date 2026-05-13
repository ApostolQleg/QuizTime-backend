import mongoose from "mongoose";

const normalizeId = (value) => {
	if (value == null) return null;
	if (typeof value === "object" && value._id != null) {
		return String(value._id);
	}
	return String(value);
};

const toAuthorDto = (author) => {
	if (author == null) {
		return { authorId: null };
	}

	if (typeof author === "string" || author instanceof mongoose.Types.ObjectId) {
		return { authorId: author.toString() };
	}

	if (typeof author === "object") {
		const authorDto = {
			authorId: normalizeId(author),
		};

		if (author.nickname !== undefined) authorDto.authorName = author.nickname;
		if (author.avatarUrl !== undefined) authorDto.authorAvatarUrl = author.avatarUrl;
		if (author.avatarType !== undefined) authorDto.authorAvatarType = author.avatarType;
		if (author.themeColor !== undefined) authorDto.authorThemeColor = author.themeColor;

		return authorDto;
	}

	return { authorId: String(author) };
};

export const normalizeQuizListItem = (quiz) => {
	if (!quiz) return null;

	const quizData = typeof quiz.toObject === "function" ? quiz.toObject() : quiz;
	const authorValue = quizData.authorId;
	let authorId = null;
	let authorName = null;

	if (typeof authorValue === "string" || authorValue instanceof mongoose.Types.ObjectId) {
		authorId = authorValue.toString();
	} else if (authorValue && typeof authorValue === "object") {
		authorId = authorValue._id ?? authorValue.id ?? null;
		authorId = authorId == null ? null : String(authorId);
		authorName = authorValue.nickname ?? null;
	}

	return {
		_id: quizData._id,
		title: quizData.title,
		category: quizData.category,
		tags: quizData.tags || [],
		questionsCount: Array.isArray(quizData.questions) ? quizData.questions.length : 0,
		authorId,
		authorName,
	};
};

export const normalizeQuizList = (quizzes = []) => {
	return quizzes.map(normalizeQuizListItem).filter(Boolean);
};

export const normalizeQuizDetails = (quiz) => {
	if (!quiz) return null;

	const quizData = typeof quiz.toObject === "function" ? quiz.toObject() : quiz;
	const quizDto = { ...quizData };
	delete quizDto.id;

	return {
		...quizDto,
		...toAuthorDto(quizData.authorId),
	};
};

export const buildCreatePayload = ({ title, category, tags, description, questions, userId }) => {
	return {
		title: title?.trim(),
		category: category?.trim(),
		tags: tags || [],
		description: description?.trim() || "",
		questions,
		authorId: userId,
	};
};

export const buildQuizUpdates = ({ title, category, tags, description, questions }) => {
	const updates = {};

	if (typeof title === "string" && title.trim()) updates.title = title.trim();
	if (typeof category === "string" && category.trim()) updates.category = category.trim();
	if (Array.isArray(tags)) updates.tags = tags;
	if (typeof description === "string") updates.description = description.trim();
	if (questions !== undefined) updates.questions = questions;

	return updates;
};
