import eventBus, { EVENTS } from "#src/shared/events/eventBus.js";
import { UserStats } from "../userStats.model.js";

async function handleQuizCompletion(payload) {
	const { userId } = payload;

	try {
		await UserStats.findOneAndUpdate(
			{ userId: userId },
			{ $inc: { quizzesPassedCount: 1 } },
			{ upsert: true, returnDocument: "after" },
		);
	} catch (error) {
		console.error(`[Stats Error] Failed to update statistics:`, error);
	}
}

export function subscribeStatsListeners() {
	eventBus.on(EVENTS.QUIZ_COMPLETED, handleQuizCompletion);
}

export function unsubscribeStatsListeners() {
	eventBus.off(EVENTS.QUIZ_COMPLETED, handleQuizCompletion);
}