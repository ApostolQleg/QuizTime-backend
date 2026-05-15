import { InvalidGoogleTokenError } from "../errors/auth.error.js";
import * as googleService from "./google.service.js";

export const getGoogleProfileOrThrow = async (token) => {
	try {
		return await googleService.verifyAndNormalizeGoogleToken(token);
	} catch {
		throw new InvalidGoogleTokenError();
	}
};
