import { checkAuth } from "#src/shared/middleware/checkAuth.js";
import * as quizController from "./controllers/quiz.controller.js";
import {
	createQuizSchema,
	deleteQuizSchema,
	quizByIdSchema,
	quizzesSchema,
	updateQuizSchema,
} from "./schemas/quiz.shema.js";

export default async function quizRoutes(fastify) {
	fastify.get(
		"/",
		{ schema: quizzesSchema, config: { rateLimit: { max: 90, timeWindow: "1 minute" } } },
		quizController.getAllQuizzes,
	);
	fastify.get(
		"/:id",
		{ schema: quizByIdSchema, config: { rateLimit: { max: 90, timeWindow: "1 minute" } } },
		quizController.getQuizById,
	);

	fastify.register(async (protectedRoutes) => {
		protectedRoutes.addHook("preHandler", checkAuth);

		protectedRoutes.post(
			"/",
			{
				schema: createQuizSchema,
				config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
			},
			quizController.createQuiz,
		);
		protectedRoutes.put(
			"/:id",
			{
				schema: updateQuizSchema,
				config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
			},
			quizController.updateQuiz,
		);
		protectedRoutes.delete(
			"/:id",
			{
				schema: deleteQuizSchema,
				config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
			},
			quizController.deleteQuiz,
		);
	});
}
