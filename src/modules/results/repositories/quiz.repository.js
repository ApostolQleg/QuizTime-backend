import { Quiz } from "#src/modules/quizzes/index.js";

export const findById = async (id) => {
	return Quiz.findById(id).lean();
};
