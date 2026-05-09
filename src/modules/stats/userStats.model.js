import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			unique: true,
			ref: "User"
		},
		quizzesPassedCount: {
			type: Number,
			default: 0
		},
	},
	{
		versionKey: false
	},
);

export default mongoose.model("UserStats", userStatsSchema, "user_stats");
