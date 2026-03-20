import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
	{
		title: String,
		description: String,
		id: String,
		questions: Array,
		authorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		authorName: String,
		createdAt: { type: Date, default: Date.now, index: true },
	},
	{ versionKey: false },
);

export default mongoose.model("Quiz", quizSchema, "quizzes");
