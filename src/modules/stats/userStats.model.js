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

export const UserStats = mongoose.model("UserStats", userStatsSchema);
