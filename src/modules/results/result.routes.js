import { resultController } from "#src/modules/results/index.js";
import {
	resultByIdSchema,
	resultsSchema,
	saveResultSchema,
} from "#src/modules/results/schemas/result.js";
import { checkAuth } from "#src/shared/middleware/checkAuth.js";

export default async function resultRoutes(fastify) {
	fastify.addHook("preHandler", checkAuth);

	fastify.get("/", { schema: resultsSchema }, resultController.getAllResults);
	fastify.get(
		"/:id",
		{ schema: resultByIdSchema },
		resultController.getResultById,
	);
	fastify.post(
		"/",
		{ schema: saveResultSchema },
		resultController.createResult,
	);
}
