const tokenBody = {
	type: "object",
	required: ["token"],
	additionalProperties: false,
	properties: {
		token: { type: "string", minLength: 16 },
	},
};

export const googleAuthSchema = {
	body: tokenBody,
};

export const googleExtractSchema = {
	body: tokenBody,
};

export const linkGoogleSchema = {
	body: tokenBody,
};
