import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

import { eventsGenerator } from "#src/modules/events/services/eventGenerator.js";

export const eventController = async (request, reply) => {
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
};
