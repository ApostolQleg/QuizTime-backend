export const registerSchema = {
	body: {
		type: "object",
		required: ["email", "password"],
		additionalProperties: false,
		properties: {
			email: { type: "string", format: "email", maxLength: 254 },
			password: { type: "string", minLength: 6, maxLength: 128 },
			avatarUrl: { type: "string", maxLength: 512 },
			code: { type: "string", minLength: 6, maxLength: 6 },
			googleToken: { type: "string", minLength: 16 },
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
			email: { type: "string", format: "email", maxLength: 254 },
			password: { type: "string", minLength: 1, maxLength: 128 },
		},
	},
};

export const sendCodeSchema = {
	body: {
		type: "object",
		required: ["email"],
		additionalProperties: false,
		properties: {
			email: { type: "string", format: "email", maxLength: 254 },
		},
	},
};
