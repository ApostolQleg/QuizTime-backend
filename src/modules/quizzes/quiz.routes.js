import { quizController } from "./index.js";
import { checkAuth } from "../../shared/middleware/checkAuth.js";
import {
	quizzesSchema,
	quizByIdSchema,
	createSchema,
	updateSchema,
	deleteSchema,
} from "./schemas/quiz.js";

export default async function quizRoutes(fastify) {
	fastify.get("/", { schema: quizzesSchema }, quizController.getAllQuizzes);
	fastify.get("/:id", { schema: quizByIdSchema }, quizController.getQuizById);

	fastify.register(async function (protectedRoutes) {
		protectedRoutes.addHook("preHandler", checkAuth);

		protectedRoutes.post("/", { schema: createSchema }, quizController.createQuiz);
		protectedRoutes.put("/:id", { schema: updateSchema }, quizController.updateQuiz);
		protectedRoutes.delete("/:id", { schema: deleteSchema }, quizController.deleteQuiz);
	});
}
