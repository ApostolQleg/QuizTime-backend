import { quizService } from "./index.js";
import { checkAuth } from "../../shared/middleware/checkAuth.js";

export default async function quizRoutes(fastify) {
	// public routes
	fastify.get(
		"/",
		{
			schema: {
				querystring: {
					type: "object",
					additionalProperties: false,
					properties: {
						limit: { type: "integer", minimum: 1, maximum: 100 },
						skip: { type: "integer", minimum: 0 },
						page: { type: "integer", minimum: 1 },
						search: { type: "string", maxLength: 120 },
						sort: { type: "string", enum: ["newest", "oldest", "az", "za"] },
						authorId: { type: "string", minLength: 1, maxLength: 64 },
					},
				},
			},
		},
		quizService.getAllQuizzes,
	);

	fastify.get(
		"/:id",
		{
			schema: {
				params: {
					type: "object",
					required: ["id"],
					additionalProperties: false,
					properties: {
						id: { type: "string", minLength: 1, maxLength: 128 },
					},
				},
			},
		},
		quizService.getQuizById,
	);

	// protected routes
	fastify.register(async function (protectedRoutes) {
		protectedRoutes.addHook("preHandler", checkAuth);

		protectedRoutes.post(
			"/",
			{
				schema: {
					body: {
						type: "object",
						required: ["id", "title", "questions"],
						additionalProperties: false,
						properties: {
							id: { type: "string", minLength: 1, maxLength: 128 },
							title: { type: "string", minLength: 1, maxLength: 160 },
							description: { type: "string", maxLength: 1000 },
							questions: { type: "array", minItems: 1, items: { type: "object" } },
						},
					},
				},
			},
			quizService.createQuiz,
		);

		protectedRoutes.put(
			"/:id",
			{
				schema: {
					params: {
						type: "object",
						required: ["id"],
						additionalProperties: false,
						properties: {
							id: { type: "string", minLength: 1, maxLength: 128 },
						},
					},
					body: {
						type: "object",
						additionalProperties: false,
						properties: {
							title: { type: "string", minLength: 1, maxLength: 160 },
							description: { type: "string", maxLength: 1000 },
							questions: { type: "array", minItems: 1, items: { type: "object" } },
						},
						anyOf: [
							{ required: ["title"] },
							{ required: ["description"] },
							{ required: ["questions"] },
						],
					},
				},
			},
			quizService.updateQuiz,
		);

		protectedRoutes.delete(
			"/:id",
			{
				schema: {
					params: {
						type: "object",
						required: ["id"],
						additionalProperties: false,
						properties: {
							id: { type: "string", minLength: 1, maxLength: 128 },
						},
					},
				},
			},
			quizService.deleteQuiz,
		);
	});
}
