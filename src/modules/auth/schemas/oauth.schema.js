import { oauthTokenSchema } from "./common.schema.js";

const tokenBody = {
	type: "object",
	required: ["token"],
	additionalProperties: false,
	properties: {
		token: oauthTokenSchema,
	},
};

export const googleAuthSchema = { body: tokenBody };
export const googleExtractSchema = { body: tokenBody };
export const linkGoogleSchema = { body: tokenBody };
