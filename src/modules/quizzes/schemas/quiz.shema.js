const REGEX = {
	OBJECT_ID: "^[a-fA-F0-9]{24}$",
	SAFE_TEXT: "^[^\\x00-\\x1F\\x7F\\u0300-\\u036F]+$",
	STRICT_TEXT: "^[a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9_\\-\\s\\.,!?]+$",
};

const quizIdParams = {
	type: "object",
	required: ["id"],
	additionalProperties: false,
	properties: {
		id: { type: "string", pattern: REGEX.OBJECT_ID },
	},
};

const quizzesQuerySchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		limit: { type: "integer", minimum: 1, maximum: 100 },
		skip: { type: "integer", minimum: 0, maximum: 1000 },
		search: { type: "string", maxLength: 120, pattern: REGEX.SAFE_TEXT },
		sort: { type: "string", enum: ["newest", "oldest", "az", "za"] },
		authorId: { type: "string", pattern: REGEX.OBJECT_ID },
	},
};

const optionSchema = {
	type: "object",
	required: ["id", "text", "isCorrect"],
	additionalProperties: false,
	properties: {
		id: { type: "integer", minimum: 0, maximum: 1000 },
		text: { type: "string", minLength: 1, maxLength: 200, pattern: REGEX.SAFE_TEXT },
		isCorrect: { type: "boolean" },
	},
};

const questionSchema = {
	type: "object",
	required: ["id", "text", "options"],
	additionalProperties: false,
	properties: {
		id: { type: "integer", minimum: 0, maximum: 1000 },
		text: { type: "string", minLength: 1, maxLength: 500, pattern: REGEX.SAFE_TEXT },
		options: {
			type: "array",
			minItems: 2,
			maxItems: 1000,
			items: optionSchema,
		},
	},
};

const quizProperties = {
	title: { type: "string", minLength: 1, maxLength: 160, pattern: REGEX.SAFE_TEXT },
	category: { type: "string", minLength: 1, maxLength: 30, pattern: REGEX.STRICT_TEXT },
	tags: {
		type: "array",
		minItems: 1,
		maxItems: 5,
		items: { type: "string", minLength: 1, maxLength: 50, pattern: REGEX.STRICT_TEXT },
	},
	description: { type: "string", maxLength: 1000, pattern: REGEX.SAFE_TEXT },
	questions: {
		type: "array",
		minItems: 1,
		maxItems: 1000,
		items: questionSchema,
	},
};

const createQuizBodySchema = {
	type: "object",
	required: ["title", "category", "questions"],
	additionalProperties: false,
	properties: quizProperties,
};

const updateQuizBodySchema = {
	type: "object",
	additionalProperties: false,
	minProperties: 1,
	properties: quizProperties,
};

export const quizByIdSchema = { params: quizIdParams };
export const quizzesSchema = { querystring: quizzesQuerySchema };
export const deleteQuizSchema = { params: quizIdParams };
export const createQuizSchema = { body: createQuizBodySchema };
export const updateQuizSchema = {
	params: quizIdParams,
	body: updateQuizBodySchema,
};
