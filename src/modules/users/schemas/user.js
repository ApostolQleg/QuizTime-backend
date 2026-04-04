export const getUserParamsSchema = {
	type: "object",
	required: ["id"],
	additionalProperties: false,
	properties: {
		id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
	},
};

export const updateProfileBodySchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		nickname: { type: "string", minLength: 2, maxLength: 64 },
		themeColor: { type: "string", maxLength: 32 },
		avatarType: { type: "string", maxLength: 32 },
	},
	anyOf: [{ required: ["nickname"] }, { required: ["themeColor"] }, { required: ["avatarType"] }],
};

export const changePasswordBodySchema = {
	type: "object",
	required: ["currentPassword", "newPassword"],
	additionalProperties: false,
	properties: {
		currentPassword: { type: "string", minLength: 1, maxLength: 128 },
		newPassword: { type: "string", minLength: 6, maxLength: 128 },
	},
};

export const getUserSchema = { params: getUserParamsSchema };
export const updateProfileSchema = { body: updateProfileBodySchema };
export const changePasswordSchema = { body: changePasswordBodySchema };
