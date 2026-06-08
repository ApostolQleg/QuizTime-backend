import { emailSchema, oauthTokenSchema, REGEX } from "#/shared/schemas/common.schema.js";

const authFields = {
	email: emailSchema,
	password: { type: "string", minLength: 6, maxLength: 128, pattern: REGEX.UNIVERSAL_TEXT },
};

export const registerSchema = {
	body: {
		type: "object",
		required: ["email"],
		additionalProperties: false,
		properties: {
			email: authFields.email,
			password: authFields.password,
			avatarUrl: { type: "string", maxLength: 512, pattern: REGEX.UNIVERSAL_TEXT },
			code: { type: "string", minLength: 6, maxLength: 6, pattern: REGEX.STRICT_CODE },
			googleToken: {
				...oauthTokenSchema,
				pattern: REGEX.JWT_TOKEN,
			},
		},
		oneOf: [{ required: ["password", "code"] }, { required: ["googleToken"] }],
	},
};

export const loginSchema = {
	body: {
		type: "object",
		required: ["email", "password"],
		additionalProperties: false,
		properties: {
			email: authFields.email,
			password: {
				type: "string",
				minLength: 1,
				maxLength: 128,
				pattern: REGEX.UNIVERSAL_TEXT,
			},
		},
	},
};

export const sendCodeSchema = {
	body: {
		type: "object",
		required: ["email"],
		additionalProperties: false,
		properties: {
			email: authFields.email,
		},
	},
};
