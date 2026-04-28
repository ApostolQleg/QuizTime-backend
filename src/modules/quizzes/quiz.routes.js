import { quizController } from "#src/modules/quizzes/index.js";
import {
	createQuizSchema,
	deleteQuizSchema,
	quizByIdSchema,
	quizzesSchema,
	updateQuizSchema,
} from "#src/modules/quizzes/schemas/quiz.js";
import { checkAuth } from "#src/shared/middleware/checkAuth.js";

export default async function quizRoutes(fastify) {
	fastify.get("/", { schema: quizzesSchema }, quizController.getAllQuizzes);
	fastify.get("/:id", { schema: quizByIdSchema }, quizController.getQuizById);

	fastify.register(async (protectedRoutes) => {
		protectedRoutes.addHook("preHandler", checkAuth);

		protectedRoutes.post("/", { schema: createQuizSchema }, quizController.createQuiz);
		protectedRoutes.put("/:id", { schema: updateQuizSchema }, quizController.updateQuiz);
		protectedRoutes.delete("/:id", { schema: deleteQuizSchema }, quizController.deleteQuiz);
	});
}
