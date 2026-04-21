import * as quizRepository from "#src/modules/results/repositories/quiz.js";
import * as resultRepository from "#src/modules/results/repositories/result.js";

export const findResults = async ({ filter, sort, skip, limit }) => {
	return resultRepository.filteredResults(limit, skip, filter, sort);
};

export const findResultById = async (id) => {
	return resultRepository.findById(id);
};

export const createResult = async (payload) => {
	return resultRepository.create(payload);
};

export const findQuizById = async (quizId) => {
	return quizRepository.findById(String(quizId));
};
