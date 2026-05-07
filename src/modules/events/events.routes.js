import { eventController } from "#src/modules/events/events.controller.js";

export async function eventRoutes(fastify) {
	fastify.get("/", eventController);
}
