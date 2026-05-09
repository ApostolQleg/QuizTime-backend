import eventBus, { EVENTS } from "#src/shared/events/eventBus.js";
import { UserStats } from "../models/userStats.model.js";

async function handleQuizCompletion(payload) {
	const { userId } = payload;
	console.log(
		`[Event: ${EVENTS.QUIZ_COMPLETED}] Received event. Updating stats for user ${userId}...`,
	);

	try {
		await UserStats.findOneAndUpdate(
			{ userId: userId },
			{ $inc: { quizzesPassedCount: 1 } },
			{ upsert: true, returnDocument: "after" },
		);
		console.log(`[Stats] Statistics updated successfully!`);
	} catch (error) {
		console.error(`[Stats Error] Failed to update statistics:`, error);
	}
}

export function subscribeStatsListeners() {
	eventBus.on(EVENTS.QUIZ_COMPLETED, handleQuizCompletion);
	console.log("[EventBus] Stats module subscribed to events.");
}