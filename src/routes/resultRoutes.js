import { getUserResults, saveResult, getResultById } from "../services/resultService.js";
import { checkAuth } from "../shared/middleware/checkAuth.js";

export default async function resultRoutes(fastify) {
	fastify.addHook("preHandler", checkAuth);

	fastify.get("/", getUserResults);
	fastify.get("/:id", getResultById);
	fastify.post("/", saveResult);
}
