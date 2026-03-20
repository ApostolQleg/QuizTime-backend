import { resultService } from "./index.js";
import { checkAuth } from "../../shared/middleware/checkAuth.js";

export default async function resultRoutes(fastify) {
	fastify.addHook("preHandler", checkAuth);

	fastify.get("/", resultService.getUserResults);
	fastify.get("/:id", resultService.getResultById);
	fastify.post("/", resultService.saveResult);
}
