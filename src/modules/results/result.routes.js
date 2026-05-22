import { checkAuth } from "#src/shared/middleware/checkAuth.js";
import * as resultController from "./controllers/result.controller.js";
import { resultByIdSchema, resultsSchema, saveResultSchema } from "./schemas/result.schema.js";

export default async function resultRoutes(fastify) {
	fastify.addHook("preHandler", checkAuth);

	fastify.get(
		"/",
		{ schema: resultsSchema, config: { rateLimit: { max: 60, timeWindow: "1 minute" } } },
		resultController.getAllResults,
	);
	fastify.get(
		"/:id",
		{ schema: resultByIdSchema, config: { rateLimit: { max: 60, timeWindow: "1 minute" } } },
		resultController.getResultById,
	);
	fastify.post(
		"/",
		{ schema: saveResultSchema, config: { rateLimit: { max: 25, timeWindow: "1 minute" } } },
		resultController.createResult,
	);
}
