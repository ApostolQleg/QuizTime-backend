import Quiz from "#src/modules/quizzes/quiz.model.js";

export const findById = async (id) => {
	return Quiz.findOne({ id }).lean();
};
