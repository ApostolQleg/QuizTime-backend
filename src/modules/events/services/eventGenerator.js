import { on } from "node:events";
import { EventSSE } from "#src/modules/events/index.js";

export async function* eventsGenerator({ signal } = {}) {
	try {
		const sseEventIter = on(EventSSE, "SSE_EVENT", { signal });

		for await (const [event] of sseEventIter) {
			yield event;
		}
	} catch (error) {
		if (error.name === "AbortError") {
			return;
		}
		throw error;
	}
}
