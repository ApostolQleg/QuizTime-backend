import { Readable } from "node:stream";

import { eventsGenerator } from "#src/modules/events/services/eventGenerator.js";

export const eventController = async (_, reply) => {
	reply.type("text/event-stream");
	reply.header("Cache-Control", "no-cache");
	reply.header("Connection", "keep-alive");

	return reply.send(Readable.from(eventsGenerator()));
};
