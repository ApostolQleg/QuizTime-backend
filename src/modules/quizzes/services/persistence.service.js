import * as quizRepository from "../repositories/quiz.repository.js";
import * as userRepository from "../repositories/user.repository.js";

export const findQuizzes = async ({ limit, skip, filter, sort }) => {
	return quizRepository.findQuizzes({ limit, skip, filter, sort });
};

export const findQuizById = async (id) => {
	return quizRepository.findQuizById(id);
};

export const createQuiz = async (payload) => {
	return quizRepository.createQuiz(payload);
};

export const updateQuizById = async (id, updates) => {
	return quizRepository.updateQuizById(id, updates);
};

export const deleteQuizById = async (id) => {
	return quizRepository.deleteQuizById(id);
};

export const findAuthorById = async (userId) => {
	return userRepository.findUserById(userId);
};
