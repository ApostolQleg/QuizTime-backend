const SAFE_TEXT_PATTERN = "^[^\\x00-\\x1F\\x7F\\u0300-\\u036F]+$";

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
		skip: { type: "integer", minimum: 0, maximum: 10000 },
		search: {
			type: "string",
			maxLength: 120,
			pattern: SAFE_TEXT_PATTERN,
		},
		sort: { type: "string", enum: ["newest", "oldest", "az", "za"] },
	},
};

const saveResultBodySchema = {
	type: "object",
	required: ["quizId", "answers", "summary"],
	additionalProperties: false,
	properties: {
		quizId: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
		answers: {
			type: "array",
			minItems: 1,
			maxItems: 1000,
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
export const resultByIdSchema = { params: resultIdParams };
export const saveResultSchema = { body: saveResultBodySchema };
