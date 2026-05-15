import * as quizRepository from "../repositories/quiz.repository.js";
import * as resultRepository from "../repositories/result.repository.js";

export const findResults = async ({ filter, sort, skip, limit }) => {
	return resultRepository.findResults({ limit, skip, filter, sort });
};

export const findResultById = async (id) => {
	return resultRepository.findResultById(id);
};

export const createResult = async (payload) => {
	return resultRepository.createResult(payload);
};

export const findQuizById = async (quizId) => {
	return quizRepository.findById(quizId);
};
