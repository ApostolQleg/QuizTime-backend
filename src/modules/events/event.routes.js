import { eventController } from "./event.controller.js";

export async function eventRoutes(fastify) {
	fastify.get(
		"/",
		{
			config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
		},
		eventController,
	);
}
