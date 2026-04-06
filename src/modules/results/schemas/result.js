const resultIdParams = {
	type: "object",
	required: ["id"],
	additionalProperties: false,
	properties: {
		id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
	},
};

const resultsQuerySchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		limit: { type: "integer", minimum: 1, maximum: 100 },
		skip: { type: "integer", minimum: 0 },
		search: { type: "string", maxLength: 120 },
		sort: { type: "string", enum: ["newest", "oldest", "az", "za"] },
	},
};

const saveResultBodySchema = {
	type: "object",
	required: ["quizId", "answers", "summary"],
	additionalProperties: false,
	properties: {
		quizId: { type: "string", minLength: 1, maxLength: 128 },
		answers: { type: "array", minItems: 1 },
		createdAt: {
			anyOf: [
				{ type: "string", format: "date-time" },
				{ type: "integer", minimum: 0 },
			],
		},
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
};

export const resultsSchema = { querystring: resultsQuerySchema };
export const resultByIdSchema = { params: resultIdParams };
export const saveResultSchema = { body: saveResultBodySchema };
