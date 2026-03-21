import { resultService } from "./index.js";
import { checkAuth } from "../../shared/middleware/checkAuth.js";

export default async function resultRoutes(fastify) {
	fastify.addHook("preHandler", checkAuth);

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
						search: { type: "string", maxLength: 120 },
						sort: { type: "string", enum: ["newest", "oldest", "az", "za"] },
					},
				},
			},
		},
		resultService.getUserResults,
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
						id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
					},
				},
			},
		},
		resultService.getResultById,
	);

	fastify.post(
		"/",
		{
			schema: {
				body: {
					type: "object",
					required: ["quizId", "answers", "summary", "timestamp"],
					additionalProperties: false,
					properties: {
						quizId: { type: "string", minLength: 1, maxLength: 128 },
						answers: { type: "array", minItems: 1, items: { type: "object" } },
						timestamp: { type: "string", format: "date-time" },
						summary: {
							type: "object",
							required: ["score", "correct", "total"],
							additionalProperties: true,
							properties: {
								score: { type: "number" },
								correct: { type: "integer", minimum: 0 },
								total: { type: "integer", minimum: 0 },
							},
						},
					},
				},
			},
		},
		resultService.saveResult,
	);
}
