import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
	{
		quizId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Quiz",
			required: true,
			index: true,
		},
		quizTitle: { type: String, required: true },
		category: { type: String, required: true },
		tags: { type: [String] },
		summary: {
			score: Number,
			correct: Number,
			total: Number,
		},
		answers: { type: Array, required: true },
		questions: { type: Array, required: true },

		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			index: true,
			required: true,
		},
	},
	{ versionKey: false },
);

export default mongoose.model("Result", resultSchema, "results");
