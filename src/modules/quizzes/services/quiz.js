import * as cacheService from "./cache.js";
import * as filterService from "./filters.js";
import * as normalizationService from "./normalization.js";
import * as permissionService from "./permissions.js";
import { findById, updateById, deleteById, create } from "../repositories/quiz.js";
import { findUserById } from "../repositories/user.js";
import {} from "../errors/quiz.js";

export const getAllQuizzes = async ({ limit, skip, search, sort, authorId }) => {
	const quizzes = await filterService.filter(limit, skip, search, sort, authorId);
	const mappedQuizzes = quizzes.map((q) => {
		const author = q.authorId || {};

		return {
			_id: q._id,
			id: q.id,
			title: q.title,
			description: q.description,
			questionsCount: q.questions.length,

			authorId: author._id || null,
			authorName: author.nickname,
			authorAvatarUrl: author.avatarUrl,
			authorAvatarType: author.avatarType,
			authorThemeColor: author.themeColor,
		};
	});

	return { quizzes: mappedQuizzes };
};

export const getQuizById = async ({ id }) => {
	const quiz = await findById(id);
	return { quiz };
};

export const createQuiz = async ({ userId, id, title, description, questions }) => {
	const exists = await findById(id);
	const user = await findUserById(userId);

	const payload = {
		id: String(id),
		title: title,
		description: description,
		questions: questions,
		authorId: userId,
		authorName: user.nickname,
	};

	const quiz = await create(payload);
	return { quiz };
};

export const updateQuiz = async ({ userId, id, title, description, questions }) => {
	const quiz = await findById(id);
	const updates = {};
	if (title) updates.title = title;
	if (description) updates.description = description;
	if (questions) updates.questions = questions;
	const updatedQuiz = await updateById(id, updates);
	return { updatedQuiz };
};

export const deleteQuiz = async ({ userId, id }) => {
	const quiz = await deleteById(id);
	return { message: "Quiz deleted successfully" };
};
