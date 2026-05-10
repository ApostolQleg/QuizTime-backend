import { eventController } from "#src/modules/events/events.controller.js";

export async function eventRoutes(fastify) {
	fastify.get(
		"/",
		{
			config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
		},
		eventController,
	);
}
