import * as quizRepository from "#src/modules/quizzes/repositories/quiz.js";
import * as userRepository from "#src/modules/quizzes/repositories/user.js";

export const findQuizzes = async ({ limit, skip, filter, sort }) => {
	return quizRepository.filteredQuizzes(limit, skip, filter, sort);
};

export const findQuizById = async (id) => {
	return quizRepository.findById(id);
};

export const createQuiz = async (payload) => {
	return quizRepository.create(payload);
};

export const updateQuizById = async (id, updates) => {
	return quizRepository.updateById(id, updates);
};

export const deleteQuizById = async (id) => {
	return quizRepository.deleteById(id);
};

export const findAuthorById = async (userId) => {
	return userRepository.findUserById(userId);
};
