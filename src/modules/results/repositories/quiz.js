import { Quiz } from "../../quizzes/quiz.model.js";

export const findById = async (id) => {
	return Quiz.findOne({ id }).lean();
};
