const quizIdParams = {
	type: "object",
	required: ["id"],
	additionalProperties: false,
	properties: {
		id: { type: "string", minLength: 1, maxLength: 128 },
	},
};

const quizzesQuerySchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		limit: { type: "integer", minimum: 1, maximum: 100 },
		skip: { type: "integer", minimum: 0 },
		search: { type: "string", maxLength: 120 },
		sort: { type: "string", enum: ["newest", "oldest", "az", "za"] },
		authorId: { type: "string", minLength: 1, maxLength: 64 },
	},
};

const createQuizBodySchema = {
	type: "object",
	required: ["id", "title", "questions"],
	additionalProperties: false,
	properties: {
		id: { type: "string", minLength: 1, maxLength: 128 },
		title: { type: "string", minLength: 1, maxLength: 160 },
		category: { type: "string", minLength: 1, maxLength: 30 },
		tags: { type: "array", minItems: 1, items: { type: "string" } },
		description: { type: "string", maxLength: 1000 },
		questions: { type: "array", minItems: 1, items: { type: "object" } },
	},
};

const updateQuizBodySchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		title: { type: "string", minLength: 1, maxLength: 160 },
		description: { type: "string", maxLength: 1000 },
		questions: { type: "array", minItems: 1, items: { type: "object" } },
	},
	anyOf: [{ required: ["title"] }, { required: ["description"] }, { required: ["questions"] }],
};

export const quizByIdSchema = { params: quizIdParams };
export const quizzesSchema = { querystring: quizzesQuerySchema };
export const deleteQuizSchema = { params: quizIdParams };
export const createQuizSchema = { body: createQuizBodySchema };
export const updateQuizSchema = {
	params: quizIdParams,
	body: updateQuizBodySchema,
};
