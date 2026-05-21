import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
	{
		title: String,
		description: String,
		category: String,
		tags: { type: [String] },
		questions: Array,
		authorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ versionKey: false },
);

export default mongoose.model("Quiz", quizSchema, "quizzes");
