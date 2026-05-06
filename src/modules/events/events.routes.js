import { EventEmitter, on } from "node:events";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

export const EventSSE = new EventEmitter();
EventSSE.setMaxListeners(0);

async function* eventsGenerator() {
	const sseEventIter = on(EventSSE, "SSE_EVENT");

	for await (const [event] of sseEventIter) {
		yield event;
	}
}

setInterval(() => emitCreateQuizSSE(10), 500);
setInterval(() => emitUpdateQuizSSE(20), 2500);
setInterval(() => emitPingSSE(), 20000);

export function emitPingSSE() {
	EventSSE.emit("SSE_EVENT", "event: PING\n\n");
}

export function emitCreateQuizSSE(quizId) {
	EventSSE.emit("SSE_EVENT", `event: CREATE_QUIZ\ndata: ${quizId}\n\n`);
}

export function emitUpdateQuizSSE(quizId) {
	EventSSE.emit("SSE_EVENT", `event: UPDATE_QUIZ\ndata: ${quizId}\n\n`);
}

export async function eventRoutes(fastify) {
	fastify.get("/events", async (request, reply) => {
		reply.raw.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		});

		reply.raw.write("event: PING\n\n");

		try {
			await pipeline(Readable.from(eventsGenerator()), reply.raw);
		} catch (err) {
			if (err.code !== "ERR_STREAM_PREMATURE_CLOSE") {
				request.log.error(err);
			}
		}
	});
}
