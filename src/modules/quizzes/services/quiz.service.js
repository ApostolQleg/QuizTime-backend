import * as sseEvents from "#src/modules/events/index.js";
import * as filterService from "./filters.service.js";
import * as normalizationService from "./normalization.service.js";
import * as permissionService from "./permissions.service.js";
import * as persistenceService from "./persistence.service.js";

const attachAuthorToQuiz = (quiz, author) => {
	const quizData = typeof quiz.toObject === "function" ? quiz.toObject() : { ...quiz };

	return {
		...quizData,
		authorId: author,
	};
};

export const getAllQuizzes = async ({ authorId, limit, skip, search, sort }) => {
	const filter = filterService.buildQuizzesFilter({ authorId, search });
	const sortQuery = filterService.buildQuizzesSort(sort);

	const quizzes = await persistenceService.findQuizzes({
		filter,
		sort: sortQuery,
		skip,
		limit,
	});

	return { quizzes: normalizationService.normalizeQuizList(quizzes) };
};

export const getQuizById = async ({ id }) => {
	const quiz = await persistenceService.findQuizById(id);
	permissionService.assertQuizExists(quiz);

	return { quiz: normalizationService.normalizeQuizDetails(quiz) };
};

export const createQuiz = async ({ userId, title, category, tags, description, questions }) => {
	permissionService.assertValidCreatePayload({
		title,
		category,
		tags,
		description,
		questions,
	});

	const author = await persistenceService.findAuthorById(userId);
	permissionService.assertAuthorExists(author);

	const payload = normalizationService.buildCreatePayload({
		title,
		category,
		tags,
		description,
		questions,
		userId,
	});

	const quiz = await persistenceService.createQuiz(payload);
	const quizWithAuthor = attachAuthorToQuiz(quiz, author);

	const [normalizedQuizForSSE] = normalizationService.normalizeQuizList([quizWithAuthor]);
	sseEvents.emitCreateQuizSSE(normalizedQuizForSSE);

	return { quiz: normalizationService.normalizeQuizDetails(quizWithAuthor) };
};

export const updateQuiz = async ({ userId, id, title, category, tags, description, questions }) => {
	const quiz = await persistenceService.findQuizById(id);
	permissionService.assertQuizExists(quiz);
	permissionService.assertCanEditQuiz(quiz, userId);
	permissionService.assertValidQuestionsForUpdate(questions);

	const updates = normalizationService.buildQuizUpdates({
		title,
		category,
		tags,
		description,
		questions,
	});

	const updatedQuiz = await persistenceService.updateQuizById(id, updates);
	const updatedQuizWithAuthor = attachAuthorToQuiz(updatedQuiz, quiz.authorId);

	const [normalizedQuizForSSE] = normalizationService.normalizeQuizList([updatedQuizWithAuthor]);
	sseEvents.emitUpdateQuizSSE(normalizedQuizForSSE);

	return { quiz: normalizationService.normalizeQuizDetails(updatedQuizWithAuthor) };
};

export const deleteQuiz = async ({ userId, id }) => {
	const quiz = await persistenceService.findQuizById(id);
	permissionService.assertQuizExists(quiz);
	permissionService.assertCanDeleteQuiz(quiz, userId);

	await persistenceService.deleteResultsByQuizId(id);
	await persistenceService.deleteQuizById(id);

	sseEvents.emitDeleteQuizSSE(id);

	return { message: "Quiz and associated results deleted successfully" };
};
