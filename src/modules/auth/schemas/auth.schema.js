const REGEX = {
	SAFE_STRING: "^[^\\x00-\\x1F\\x7F\\u0300-\\u036F]+$",
	STRICT_CODE: "^[a-zA-Z0-9]+$",
	JWT_TOKEN: "^[a-zA-Z0-9\\-_\\.]+$",
};

const authFields = {
	email: { type: "string", format: "email", maxLength: 254 },
	password: { type: "string", minLength: 6, maxLength: 128, pattern: REGEX.SAFE_STRING },
};

export const registerSchema = {
	body: {
		type: "object",
		required: ["email", "password"],
		additionalProperties: false,
		properties: {
			email: authFields.email,
			password: authFields.password,
			avatarUrl: { type: "string", maxLength: 512, pattern: REGEX.SAFE_STRING },
			code: { type: "string", minLength: 6, maxLength: 6, pattern: REGEX.STRICT_CODE },
			googleToken: {
				type: "string",
				minLength: 16,
				maxLength: 4096,
				pattern: REGEX.JWT_TOKEN,
			},
		},
		oneOf: [{ required: ["code"] }, { required: ["googleToken"] }],
	},
};

export const loginSchema = {
	body: {
		type: "object",
		required: ["email", "password"],
		additionalProperties: false,
		properties: {
			email: authFields.email,
			password: { type: "string", minLength: 1, maxLength: 128, pattern: REGEX.SAFE_STRING },
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
