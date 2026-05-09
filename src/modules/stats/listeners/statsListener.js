import eventBus, { EVENTS } from "#src/shared/events/eventBus.js";

async function handleQuizCompletion(payload) {
	const { userId } = payload;
	console.log(
		`[Event: ${EVENTS.QUIZ_COMPLETED}] Received event. Updating stats for user ${userId}...`,
	);
}

export function subscribeStatsListeners() {
	eventBus.on(EVENTS.QUIZ_COMPLETED, handleQuizCompletion);
	console.log("[EventBus] Stats module subscribed to events.");
}