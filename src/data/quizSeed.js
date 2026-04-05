import { Quiz } from "#src/modules/quizzes/index.js";
import { defaultQuizzes } from "#src/data/defaultQuizzes.js";

export const seedQuizzesIfEmpty = async () => {
	try {
		if (Quiz.collection && typeof Quiz.collection.createIndex === "function") {
			await Quiz.collection.createIndex({ id: 1 }, { unique: true });
		}
	} catch (error) {
		if (error.codeName !== "IndexOptionsConflict" && error.code !== 85) {
			throw error;
		}
	}

	const count = await Quiz.countDocuments();
	if (count === 0) {
		try {
			await Quiz.insertMany(defaultQuizzes.quizzes);
		} catch (error) {
			if (error.code !== 11000) {
				throw error;
			}
		}
	}
};
