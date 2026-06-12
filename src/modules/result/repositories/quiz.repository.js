import { Quiz } from "#src/modules/quiz/index.js";

export const findById = async (id) => {
	return Quiz.findById(id).lean();
};
