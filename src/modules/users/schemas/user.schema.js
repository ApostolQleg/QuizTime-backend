import { idParamsSchema, REGEX } from "./common.schema.js";

export const updateProfileBodySchema = {
	type: "object",
	additionalProperties: false,
	minProperties: 1,
	properties: {
		nickname: {
			type: "string",
			minLength: 2,
			maxLength: 64,
			pattern: REGEX.UNIVERSAL_TEXT,
		},
		themeColor: {
			type: "string",
			maxLength: 32,
			pattern: REGEX.COLOR,
		},
		avatarType: {
			type: "string",
			enum: ["google", "generated"],
		},
	},
};

export const changePasswordBodySchema = {
	type: "object",
	required: ["currentPassword", "newPassword"],
	additionalProperties: false,
	properties: {
		currentPassword: {
			type: "string",
			minLength: 1,
			maxLength: 128,
			pattern: REGEX.UNIVERSAL_TEXT,
		},
		newPassword: {
			type: "string",
			minLength: 6,
			maxLength: 128,
			pattern: REGEX.UNIVERSAL_TEXT,
		},
	},
};

export const getCurrentUserSchema = { params: idParamsSchema };
export const updateProfileSchema = { body: updateProfileBodySchema };
export const changePasswordSchema = { body: changePasswordBodySchema };

export const getNicknameSuggestionsSchema = {
	querystring: {
		type: "object",
		additionalProperties: false,
	},
};
