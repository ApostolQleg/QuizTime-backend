import { baseListQueryProperties, idParamsSchema, objectIdSchema } from "./common.schema.js";

const resultsQuerySchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		...baseListQueryProperties,
	},
};

const saveResultBodySchema = {
	type: "object",
	required: ["quizId", "answers", "summary"],
	additionalProperties: false,
	properties: {
		quizId: objectIdSchema,
		answers: {
			type: "array",
			minItems: 1,
			maxItems: 1000,
			items: {
				type: "array",
				maxItems: 1000,
				items: { type: "integer", minimum: 0, maximum: 1000 },
			},
		},
		summary: {
			type: "object",
			required: ["score", "correct", "total"],
			additionalProperties: false,
			properties: {
				score: { type: "number", minimum: 0, maximum: 1000000 },
				correct: { type: "integer", minimum: 0, maximum: 1000 },
				total: { type: "integer", minimum: 0, maximum: 1000 },
			},
		},
	},
};

export const resultsSchema = { querystring: resultsQuerySchema };
export const resultByIdSchema = { params: idParamsSchema };
export const saveResultSchema = { body: saveResultBodySchema };
