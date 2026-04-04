import { Quiz } from "./index.js";
import { User } from "../users/index.js";

export const getAllQuizzes = async (authorId, limit, skip, search, sort) => {
	let filter = {};
	if (authorId) filter.authorId = authorId;
	if (search) {
		const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		filter.title = { $regex: escapedSearch, $options: "i" };
	}

	let sortQuery = { createdAt: -1 };
	if (sort === "oldest") sortQuery = { createdAt: 1 };
	else if (sort === "az") sortQuery = { title: 1, createdAt: -1 };
	else if (sort === "za") sortQuery = { title: -1, createdAt: -1 };

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

	return { ok: true, quizzes: mappedQuizzes, code: 200 };
};

export const createQuiz = async (userId, id, title, description, questions) => {
	if (!id || !title) {
		return { ok: false, error: "Invalid payload", code: 400 };
	}

	if (!Array.isArray(questions) || questions.length === 0) {
		return { ok: false, error: "Quiz must have at least one question", code: 400 };
	}

	const exists = await Quiz.findOne({ id });
	if (exists) return { ok: false, error: "Quiz with this id already exists", code: 409 };

	const user = await User.findById(userId);
	if (!user) return { ok: false, error: "Author not found", code: 404 };

	const quiz = new Quiz({
		id: String(id),
		title: title,
		description: description,
		questions: questions,
		authorId: userId,
		authorName: user.nickname,
	});

	await quiz.save();

	return { ok: true, quiz, code: 201 };
};

export const getQuizById = async (id) => {
	const quiz = await Quiz.findOne({ id });
	if (!quiz) return { ok: false, error: "Quiz not found", code: 404 };
	return { ok: true, quiz, code: 200 };
};

export const updateQuiz = async (userId, id, title, description, questions) => {
	const quiz = await Quiz.findOne({ id });
	if (!quiz) return { ok: false, error: "Quiz not found", code: 404 };

	if (!quiz.authorId) return { ok: false, error: "Cannot edit system quizzes", code: 403 };

	if (String(quiz.authorId) !== String(userId))
		return { ok: false, error: "You are not the author", code: 403 };

	const updates = {};
	if (title) updates.title = title;
	if (description) updates.description = description;
	if (questions) {
		if (!Array.isArray(questions)) {
			return { ok: false, error: "Questions must be an array", code: 400 };
		}
		updates.questions = questions;
	}
	const updatedQuiz = await Quiz.findOneAndUpdate({ id }, { $set: updates }, { new: true });

	return { ok: true, quiz: updatedQuiz, code: 200 };
};

export const deleteQuiz = async (userId, id) => {
	const quiz = await Quiz.findOne({ id });
	if (!quiz) return { ok: false, error: "Quiz not found", code: 404 };

	if (!quiz.authorId) return { ok: false, error: "Cannot delete system quizzes", code: 403 };

	if (String(quiz.authorId) !== String(userId))
		return { ok: false, error: "You are not the author", code: 403 };

	await Quiz.findOneAndDelete({ id });

	return { ok: true, message: "Quiz deleted successfully", code: 200 };
};
