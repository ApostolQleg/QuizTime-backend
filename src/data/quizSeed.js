import { Quiz } from "../modules/quizzes/index.js";
import { defaultQuizzes } from "./defaultQuizzes.js";

export const seedQuizzesIfEmpty = async () => {
	const count = await Quiz.countDocuments();
	if (count === 0) {
		await Quiz.insertMany(defaultQuizzes.quizzes);
	}
};
