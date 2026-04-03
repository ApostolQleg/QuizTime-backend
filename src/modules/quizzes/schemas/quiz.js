const quizIdParams = {
	params: {
		type: "object",
		required: ["id"],
		additionalProperties: false,
		properties: {
			id: { type: "string", minLength: 1, maxLength: 128 },
		},
	},
};

export const quizzesSchema = {
	querystring: {
		type: "object",
		additionalProperties: false,
		properties: {
			limit: { type: "integer", minimum: 1, maximum: 100 },
			skip: { type: "integer", minimum: 0 },
			search: { type: "string", maxLength: 120 },
			sort: { type: "string", enum: ["newest", "oldest", "az", "za"] },
			authorId: { type: "string", minLength: 1, maxLength: 64 },
		},
	},
};

export const quizByIdSchema = { quizIdParams };

export const createSchema = {
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
};

export const updateSchema = {
	quizIdParams,
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
};

export const deleteSchema = { quizIdParams };
