import readline from "node:readline/promises";
import mongoose from "mongoose";
import "dotenv/config";
import { Quiz } from "#src/modules/quizzes/index.js";
import { Result } from "#src/modules/results/index.js";

const AUTHOR_ID = process.env.AUTHOR_ID;

export async function seedMany(datatype, startNum = 0, endNum = 0) {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB for seeding...");

		const BATCH_SIZE = 100;
		let totalInserted = 0;

		if (datatype === "results") {
			const targetValues = [];
			for (let i = startNum; i <= endNum; i++) targetValues.push(String(i));

			const matchingQuizzesCount = await Quiz.countDocuments({
				title: { $in: targetValues },
			});
			if (matchingQuizzesCount === 0) {
				console.log("No matching quizzes found. Please seed quizzes first!");
				await mongoose.disconnect();
				process.exit(1);
			}
		}

		for await (const batch of generateDataInBatches(datatype, startNum, endNum, BATCH_SIZE)) {
			if (datatype === "quizzes") {
				await Quiz.insertMany(batch);
			} else if (datatype === "results") {
				await Result.insertMany(batch);
			}

			totalInserted += batch.length;
			console.log(`Inserted ${totalInserted} ${datatype}`);
		}

		console.log(`\n${totalInserted} ${datatype} have been inserted successfully!`);

		await mongoose.disconnect();
		process.exit(0);
	} catch (error) {
		console.error("Seeding error:", error);
		process.exit(1);
	}
}

async function* generateDataInBatches(datatype, startNum = 0, endNum = 0, batchSize = 100) {
	let batch = [];
	const targetValues = [];
	for (let i = startNum; i <= endNum; i++) targetValues.push(String(i));

	if (datatype === "quizzes") {
		for (let i = startNum; i <= endNum; i++) {
			const num = String(i);
			batch.push({
				title: num,
				description: `Generated quiz ${num}`,
				category: "Other",
				tags: ["Default", "Test"],
				questions: [
					{
						id: 0,
						text: num,
						options: [
							{ id: 0, text: "Yes", isCorrect: true },
							{ id: 1, text: "No", isCorrect: false },
						],
					},
				],
				authorId: AUTHOR_ID,
			});

			if (batch.length === batchSize) {
				yield batch;
				batch = [];
			}
		}
	} else if (datatype === "results") {
		const existingQuizzes = await Quiz.find({ title: { $in: targetValues } }, "_id");

		for (const quiz of existingQuizzes) {
			batch.push({
				quizId: quiz._id,
				summary: { score: 1, correct: 1, total: 1 },
				answers: [[0]],
				userId: AUTHOR_ID,
			});

			if (batch.length === batchSize) {
				yield batch;
				batch = [];
			}
		}
	}

	if (batch.length > 0) {
		yield batch;
	}
}

export async function deleteManyItems(datatype, startNum = 0, endNum = 0) {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB for targeted deletion...");

		const targetValues = [];
		for (let i = startNum; i <= endNum; i++) targetValues.push(String(i));

		let deleteResult;

		if (datatype === "quizzes") {
			const quizzesToDelete = await Quiz.find(
				{
					title: { $in: targetValues },
					authorId: AUTHOR_ID,
				},
				"_id",
			);

			const quizIds = quizzesToDelete.map((q) => q._id);

			const cascadedDelete = await Result.deleteMany({
				quizId: { $in: quizIds },
			});
			console.log(
				`Cascaded: Deleted ${cascadedDelete.deletedCount} results associated with these quizzes.`,
			);

			deleteResult = await Quiz.deleteMany({
				_id: { $in: quizIds },
			});
		} else if (datatype === "results") {
			const quizzes = await Quiz.find({ title: { $in: targetValues } }, "_id");
			const quizIds = quizzes.map((q) => q._id);

			deleteResult = await Result.deleteMany({
				quizId: { $in: quizIds },
				userId: AUTHOR_ID,
			});
		}

		console.log(`Successfully deleted ${deleteResult.deletedCount} ${datatype}!`);

		await mongoose.disconnect();
		process.exit(0);
	} catch (error) {
		console.error("Deletion error:", error);
		process.exit(1);
	}
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const action = await rl.question("Choose action - Seed or Delete? (Enter 's' or 'd'): ");
if (action !== "s" && action !== "d") {
	console.log("Invalid action. Exiting.");
	process.exit(1);
}

const datatypeInput = await rl.question("Which data - Quizzes or Results? (Enter 'q' or 'r'): ");
if (datatypeInput !== "q" && datatypeInput !== "r") {
	console.log("Invalid data type. Exiting.");
	process.exit(1);
}

const startnum = parseInt(await rl.question("Enter the starting number: "), 10) || 0;
const endnum = parseInt(await rl.question("Enter the ending number: "), 10) || 0;

rl.close();

const datatype = datatypeInput === "q" ? "quizzes" : "results";

if (action === "s") {
	await seedMany(datatype, startnum, endnum);
} else if (action === "d") {
	await deleteManyItems(datatype, startnum, endnum);
}
