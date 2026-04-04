import * as googleService from "#src/modules/auth/services/google.js";
import { InvalidGoogleTokenError } from "#src/modules/auth/errors/auth.js";

export const getGoogleProfileOrThrow = async (token) => {
	try {
		return await googleService.verifyAndNormalizeGoogleToken(token);
	} catch {
		throw new InvalidGoogleTokenError();
	}
};
