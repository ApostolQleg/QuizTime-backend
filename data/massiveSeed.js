import mongoose from "mongoose";
import "dotenv/config";
import Quiz from "../models/Quiz.js";

const seedDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB for seeding");

		const quizzesToInsert = [];
		const START_NUM = 102;
		const END_NUM = 199;

		const AUTHOR_ID = "69a01df66918747ee397f9f1";

		for (let i = START_NUM; i <= END_NUM; i++) {
			const quizNumber = String(i);

			quizzesToInsert.push({
				title: quizNumber,
				description: `Generated quiz ${quizNumber}`,
				id: String(performance.now() + i),
				questions: [
					{
						id: 0,
						text: quizNumber,
						options: [
							{ id: 0, text: "Yes", isCorrect: true },
							{ id: 1, text: "No", isCorrect: false },
						],
					},
				],
				authorId: AUTHOR_ID,
				authorName: "ApostolOleg",
			});
		}

		await Quiz.insertMany(quizzesToInsert);

		console.log(`${quizzesToInsert.length} quizzes have been inserted successfully!`);

		await mongoose.disconnect();
		process.exit(0);
	} catch (error) {
		console.error("Seeding error:", error);
		process.exit(1);
	}
};

seedDatabase();
