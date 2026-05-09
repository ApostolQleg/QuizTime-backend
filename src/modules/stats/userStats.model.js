import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
		unique: true
	},
	quizzesPassedCount: {
		type: Number,
		default: 0
	},
});

export const UserStats = mongoose.model("UserStats", userStatsSchema);
