export const REGEX = {
	OBJECT_ID: "^[a-fA-F0-9]{24}$",
	UNIVERSAL_TEXT: "^(?!.*[\\u0300-\\u036f]{3,})[^\\x00-\\x1F\\x7F-\\x9F]+$",
	SYSTEM_NAME: "^[a-zA-Z0-9#_\\-]+$",
	COLOR: "^(?:(hsl|hsla|rgb|rgba)\\([0-9.,\\s%]+\\)|#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8}))$",
	STRICT_CODE: "^[a-zA-Z0-9]+$",
	JWT_TOKEN: "^[a-zA-Z0-9\\-_\\.]+$",
};

export const objectIdSchema = {
	type: "string",
	pattern: REGEX.OBJECT_ID,
};

export const idParamsSchema = {
	type: "object",
	required: ["id"],
	additionalProperties: false,
	properties: {
		id: objectIdSchema,
	},
};

export const baseListQueryProperties = {
	limit: { type: "integer", minimum: 1, maximum: 100 },
	skip: { type: "integer", minimum: 0, maximum: 10000 },
	search: { type: "string", maxLength: 120, pattern: REGEX.UNIVERSAL_TEXT },
	sort: { type: "string", enum: ["newest", "oldest", "az", "za"] },
};

export const emailSchema = {
	type: "string",
	format: "email",
	maxLength: 254,
};

export const oauthTokenSchema = {
	type: "string",
	minLength: 16,
	maxLength: 4096,
};
