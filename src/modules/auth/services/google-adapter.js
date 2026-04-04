import * as googleService from "./google.js";
import { InvalidGoogleTokenError } from "../errors/auth.js";

export const getGoogleProfileOrThrow = async (token) => {
	try {
		return await googleService.verifyAndNormalizeGoogleToken(token);
	} catch {
		throw new InvalidGoogleTokenError();
	}
};
