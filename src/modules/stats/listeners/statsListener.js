import eventBus, { EVENTS } from "#src/shared/events/eventBus.js";
import UserStats from "../userStats.model.js";

async function handleQuizCompletion(payload) {
	if (!payload?.userId) {
		console.warn(`[Event Warning] ${EVENTS.QUIZ_COMPLETED} emitted with invalid payload:`, payload);
		return;
	}

	const { userId } = payload;

	try {
		await UserStats.findOneAndUpdate(
			{ userId: userId },
			{ $inc: { quizzesPassedCount: 1 } },
			{ upsert: true, returnDocument: "after" },
		);
	} catch (error) {
		if (error?.code === 11000) {
 			try {
 				await UserStats.findOneAndUpdate(
 					{ userId: userId },
 					{ $inc: { quizzesPassedCount: 1 } },
 					{ upsert: false, returnDocument: "after" },
 				);
 				return;
 			} catch (retryError) {
 				console.error(
 					`[Stats Error] Failed to update statistics after duplicate-key retry:`,
 					retryError,
 				);
 				return;
 			}
 		}
		console.error(`[Stats Error] Failed to update statistics:`, error);
	}
}

export function subscribeStatsListeners() {
	eventBus.on(EVENTS.QUIZ_COMPLETED, handleQuizCompletion);
}

export function unsubscribeStatsListeners() {
	eventBus.off(EVENTS.QUIZ_COMPLETED, handleQuizCompletion);
}