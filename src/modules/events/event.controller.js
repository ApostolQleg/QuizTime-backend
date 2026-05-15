import { Readable } from "node:stream";
import { eventsGenerator } from "./services/event-generator.service.js";

export const eventController = async (request, reply) => {
	request.raw.socket.setTimeout(0);
	request.raw.socket.setKeepAlive(true);

	reply.type("text/event-stream");
	reply.header("Cache-Control", "no-cache");
	reply.header("Connection", "keep-alive");

	const ac = new AbortController();

	const abortGenerator = () => {
		if (!ac.signal.aborted) {
			ac.abort();
		}
	};

	request.raw.on("close", abortGenerator);
	request.raw.on("aborted", abortGenerator);
	reply.raw.on("close", abortGenerator);

	return reply.send(Readable.from(eventsGenerator({ signal: ac.signal })));
};
