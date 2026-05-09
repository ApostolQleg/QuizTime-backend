import { Readable } from "node:stream";
import { eventsGenerator } from "#src/modules/events/services/eventGenerator.js";

export const eventController = async (request, reply) => {
	reply.type("text/event-stream");
	reply.header("Cache-Control", "no-cache");
	reply.header("Connection", "keep-alive");

	const ac = new AbortController();

	request.raw.on("close", () => {
		ac.abort();
	});

	return reply.send(Readable.from(eventsGenerator({ signal: ac.signal })));
};
