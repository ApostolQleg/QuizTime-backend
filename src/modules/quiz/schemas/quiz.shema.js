import {
	baseListQueryProperties,
	idParamsSchema,
	objectIdSchema,
	REGEX,
} from "#src/shared/schemas/common.schema.js";

const quizzesQuerySchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		...baseListQueryProperties,
		authorId: objectIdSchema,
	},
};

const optionSchema = {
	type: "object",
	required: ["id", "text", "isCorrect"],
	additionalProperties: false,
	properties: {
		id: { type: "integer", minimum: 0, maximum: 1000 },
		text: { type: "string", minLength: 1, maxLength: 200, pattern: REGEX.UNIVERSAL_TEXT },
		isCorrect: { type: "boolean" },
	},
};

const questionSchema = {
	type: "object",
	required: ["id", "text", "options"],
	additionalProperties: false,
	properties: {
		id: { type: "integer", minimum: 0, maximum: 1000 },
		text: { type: "string", minLength: 1, maxLength: 500, pattern: REGEX.UNIVERSAL_TEXT },
		options: {
			type: "array",
			minItems: 2,
			maxItems: 1000,
			items: optionSchema,
		},
	},
};

const quizProperties = {
	title: { type: "string", minLength: 1, maxLength: 160, pattern: REGEX.UNIVERSAL_TEXT },
	category: { type: "string", minLength: 1, maxLength: 30, pattern: REGEX.UNIVERSAL_TEXT },
	tags: {
		type: "array",
		minItems: 1,
		maxItems: 5,
		items: { type: "string", minLength: 1, maxLength: 50, pattern: REGEX.UNIVERSAL_TEXT },
	},
	description: { type: "string", maxLength: 1000, pattern: REGEX.UNIVERSAL_TEXT },
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

export const quizByIdSchema = { params: idParamsSchema };
export const quizzesSchema = { querystring: quizzesQuerySchema };
export const deleteQuizSchema = { params: idParamsSchema };
export const createQuizSchema = { body: createQuizBodySchema };
export const updateQuizSchema = {
	params: idParamsSchema,
	body: updateQuizBodySchema,
};
