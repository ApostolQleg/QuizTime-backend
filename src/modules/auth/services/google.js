import { verifyGoogleToken } from "../../../infrastructure/google/googleClient.js";

export const verifyAndNormalizeGoogleToken = async (token) => {
	const payload = await verifyGoogleToken(token);

	return {
		email: payload.email,
		googleId: payload.sub,
		picture: payload.picture,
	};
};
