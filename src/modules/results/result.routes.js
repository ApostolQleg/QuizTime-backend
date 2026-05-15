import { checkAuth } from "#src/shared/middleware/checkAuth.js";
import * as resultController from "./controllers/result.controller.js";
import { resultByIdSchema, resultsSchema, saveResultSchema } from "./schemas/result.schema.js";

export default async function resultRoutes(fastify) {
	fastify.addHook("preHandler", checkAuth);

	fastify.get("/", { schema: resultsSchema }, resultController.getAllResults);
	fastify.get("/:id", { schema: resultByIdSchema }, resultController.getResultById);
	fastify.post("/", { schema: saveResultSchema }, resultController.createResult);
}
