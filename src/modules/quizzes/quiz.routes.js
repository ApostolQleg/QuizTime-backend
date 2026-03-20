import { quizService } from "./index.js";
import { checkAuth } from "../../shared/middleware/checkAuth.js";

export default async function quizRoutes(fastify) {
	// public routes
	fastify.get("/", quizService.getAllQuizzes);
	fastify.get("/:id", quizService.getQuizById);

	// protected routes
	fastify.register(async function (protectedRoutes) {
		protectedRoutes.addHook("preHandler", checkAuth);

		protectedRoutes.post("/", quizService.createQuiz);
		protectedRoutes.put("/:id", quizService.updateQuiz);
		protectedRoutes.delete("/:id", quizService.deleteQuiz);
	});
}
