const REGEX = {
	SAFE_STRING: "^[^\\x00-\\x1F\\x7F\\u0300-\\u036F]+$",
	NICKNAME: "^[a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9_\\-\\s]+$",
	SYSTEM_NAME: "^[a-zA-Z0-9#_\\-]+$",
};

export const userByIdParamsSchema = {
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
	minProperties: 1,
	properties: {
		nickname: {
			type: "string",
			minLength: 2,
			maxLength: 64,
			pattern: REGEX.NICKNAME,
		},
		themeColor: {
			type: "string",
			maxLength: 32,
		},
		avatarType: {
			type: "string",
			maxLength: 32,
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
			pattern: REGEX.SAFE_STRING,
		},
		newPassword: {
			type: "string",
			minLength: 6,
			maxLength: 128,
			pattern: REGEX.SAFE_STRING,
		},
	},
};

export const getCurrentUserSchema = { params: userByIdParamsSchema };
export const updateProfileSchema = { body: updateProfileBodySchema };
export const changePasswordSchema = { body: changePasswordBodySchema };

export const getNicknameSuggestionsSchema = {
	querystring: { type: "object", additionalProperties: false },
};
