import { on } from "node:events";
import { EventSSE } from "#src/modules/events/index.js";

export async function* eventsGenerator() {
	const sseEventIter = on(EventSSE, "SSE_EVENT");

	for await (const [event] of sseEventIter) {
		yield event;
	}
}
