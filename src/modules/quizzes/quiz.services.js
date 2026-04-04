import { Quiz } from "./index.js";
import { User } from "../users/index.js";
import Memoizer from "../../shared/utils/memoizer.js";

const cache = new Memoizer();

const findQuiz = async (id) => {
	return await Quiz.findOne({ id: id }).populate(
		"authorId",
		"nickname avatarUrl avatarType themeColor",
	);
};

const getCachedQuiz = cache.memoize(findQuiz);
const clearQuizCache = () => cache.clear(findQuiz);

export const getAllQuizzes = async (limit, skip, searchParam, sortParam, authorId) => {
	let filter = {};
	if (authorId) filter.authorId = authorId;
	if (searchParam) {
		const escapedSearch = searchParam.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		filter.title = { $regex: escapedSearch, $options: "i" };
	}

	let sortQuery = { createdAt: -1 };
	if (sortParam === "oldest") sortQuery = { createdAt: 1 };
	else if (sortParam === "az") sortQuery = { title: 1, createdAt: -1 };
	else if (sortParam === "za") sortQuery = { title: -1, createdAt: -1 };

	const quizzes = await Quiz.find(filter)
		.collation({ locale: "uk", strength: 2 })
		.sort(sortQuery)
		.skip(skip)
		.limit(limit)
		.select("id title description questions authorId createdAt")
		.populate("authorId", "nickname avatarUrl avatarType themeColor");

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

	return { ok: true, quizzes: mappedQuizzes };
};

export const createQuiz = async (userId, id, title, description, questions) => {
	if (!id || !title) {
		return { ok: false, error: "Invalid payload" };
	}

	if (!Array.isArray(questions) || questions.length === 0) {
		return { ok: false, error: "Quiz must have at least one question" };
	}

	const exists = await Quiz.findOne({ id });
	if (exists) return { ok: false, error: "Quiz with this id already exists" };

	const user = await User.findById(userId);
	if (!user) return { ok: false, error: "Author not found" };

	const quiz = new Quiz({
		id: String(id),
		title: title,
		description: description,
		questions: questions,
		authorId: userId,
		authorName: user.nickname,
	});

	await quiz.save();

	return { ok: true, quiz };
};

export const getQuizById = async (id) => {
	const quiz = await getCachedQuiz(id);
	if (!quiz) return { ok: false, error: "Quiz not found" };

	const author = quiz.authorId || {};

	const responseQuiz = {
		...quiz.toObject(),
		authorId: author._id || null,
		authorName: author.nickname,
		authorAvatarUrl: author.avatarUrl,
		authorAvatarType: author.avatarType,
		authorThemeColor: author.themeColor,
	};

	return { ok: true, quiz: responseQuiz };
};

export const updateQuiz = async (userId, id, title, description, questions) => {
	const quiz = await Quiz.findOne({ id });
	if (!quiz) return { ok: false, error: "Quiz not found" };

	if (!quiz.authorId) return { ok: false, error: "Cannot edit system quizzes" };

	if (String(quiz.authorId) !== String(userId))
		return { ok: false, error: "You are not the author" };

	const updates = {};
	if (title) updates.title = title;
	if (description) updates.description = description;
	if (questions) {
		if (!Array.isArray(questions)) return { ok: false, error: "Questions must be an array" };
		updates.questions = questions;
	}
	const updatedQuiz = await Quiz.findOneAndUpdate({ id }, { $set: updates }, { new: true });

	clearQuizCache(id);

	return { ok: true, quiz: updatedQuiz };
};

export const deleteQuiz = async (userId, id) => {
	const quiz = await Quiz.findOne({ id });
	if (!quiz) return { ok: false, error: "Quiz not found" };

	if (!quiz.authorId) return { ok: false, error: "Cannot delete system quizzes" };

	if (String(quiz.authorId) !== String(userId))
		return { ok: false, error: "You are not the author" };

	await Quiz.findOneAndDelete({ id });

	return { ok: true, message: "Quiz deleted successfully" };
};
