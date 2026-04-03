import { authController, oauthController } from "./index.js";
import { checkAuth } from "../../shared/middleware/checkAuth.js";
import { loginSchema, registerSchema, sendCodeSchema } from "./schemas/auth.js";
import { googleAuthSchema, googleExtractSchema, linkGoogleSchema } from "./schemas/oauth.js";

export default async function authRoutes(fastify) {
	fastify.post(
		"/register",
		{
			config: { rateLimit: { max: 8, timeWindow: "1 minute" } },
			schema: registerSchema,
		},
		authController.register,
	);

	fastify.post(
		"/login",
		{
			config: { rateLimit: { max: 6, timeWindow: "1 minute" } },
			schema: loginSchema,
		},
		authController.login,
	);

	fastify.post(
		"/google",
		{
			config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
			schema: googleAuthSchema,
		},
		oauthController.googleAuth,
	);

	fastify.post(
		"/google-extract",
		{
			config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
			schema: googleExtractSchema,
		},
		oauthController.googleExtract,
	);

	fastify.post(
		"/send-code",
		{
			config: { rateLimit: { max: 3, timeWindow: "1 minute" } },
			schema: sendCodeSchema,
		},
		authController.sendCode,
	);

	fastify.post(
		"/link-google",
		{
			preHandler: checkAuth,
			config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
			schema: linkGoogleSchema,
		},
		oauthController.linkGoogle,
	);
}
