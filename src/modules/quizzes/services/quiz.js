import * as filterService from "#src/modules/quizzes/services/filters.js";
import * as normalizationService from "#src/modules/quizzes/services/normalization.js";
import * as permissionService from "#src/modules/quizzes/services/permissions.js";
import * as persistenceService from "#src/modules/quizzes/services/persistence.js";

export const getAllQuizzes = async ({ authorId, limit, skip, search, sort }) => {
	const quizzes = await filterService.filter(authorId, limit, skip, search, sort);
	return { quizzes: normalizationService.normalizeQuizList(quizzes) };
};

export const getQuizById = async ({ id }) => {
	const quiz = await persistenceService.findQuizById(id);
	permissionService.assertQuizExists(quiz);

	return { quiz: normalizationService.normalizeQuizDetails(quiz) };
};

export const createQuiz = async ({ userId, id, title, description, questions }) => {
	permissionService.assertValidCreatePayload({ id, title, questions });

	const existingQuiz = await persistenceService.findQuizById(id);
	permissionService.assertQuizNotExists(existingQuiz);

	const author = await persistenceService.findAuthorById(userId);
	permissionService.assertAuthorExists(author);

	const payload = normalizationService.buildCreatePayload({
		id,
		title,
		description,
		questions,
		userId,
		user: author,
	});

	const quiz = await persistenceService.createQuiz(payload);
	return { quiz };
};

export const updateQuiz = async ({ userId, id, title, description, questions }) => {
	const quiz = await persistenceService.findQuizById(id);
	permissionService.assertQuizExists(quiz);
	permissionService.assertCanEditQuiz(quiz, userId);
	permissionService.assertValidQuestionsForUpdate(questions);

	const updates = normalizationService.buildQuizUpdates({
		title,
		description,
		questions,
	});

	const updatedQuiz = await persistenceService.updateQuizById(id, updates);
	return { quiz: updatedQuiz };
};

export const deleteQuiz = async ({ userId, id }) => {
	const quiz = await persistenceService.findQuizById(id);
	permissionService.assertQuizExists(quiz);
	permissionService.assertCanDeleteQuiz(quiz, userId);

	await persistenceService.deleteQuizById(id);
	return { message: "Quiz deleted successfully" };
};
