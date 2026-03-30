import { authController } from "./index.js";
import { checkAuth } from "../../shared/middleware/checkAuth.js";

export default async function authRoutes(fastify) {
	fastify.post(
		"/register",
		{
			config: { rateLimit: { max: 8, timeWindow: "1 minute" } },
			schema: {
				body: {
					type: "object",
					required: ["email", "password"],
					additionalProperties: false,
					properties: {
						email: { type: "string", format: "email" },
						password: { type: "string", minLength: 6, maxLength: 128 },
						avatarUrl: { type: "string", maxLength: 512 },
						code: { type: "string", minLength: 6, maxLength: 6 },
						googleToken: { type: "string", minLength: 16 },
					},
					oneOf: [{ required: ["code"] }, { required: ["googleToken"] }],
				},
			},
		},
		authController.register,
	);

	fastify.post(
		"/login",
		{
			config: { rateLimit: { max: 6, timeWindow: "1 minute" } },
			schema: {
				body: {
					type: "object",
					required: ["email", "password"],
					additionalProperties: false,
					properties: {
						email: { type: "string", format: "email", maxLength: 254 },
						password: { type: "string", minLength: 1, maxLength: 128 },
					},
				},
			},
		},
		authController.login,
	);

	fastify.post(
		"/google",
		{
			config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
			schema: {
				body: {
					type: "object",
					required: ["token"],
					additionalProperties: false,
					properties: {
						token: { type: "string", minLength: 16 },
					},
				},
			},
		},
		authController.googleAuth,
	);

	fastify.post(
		"/google-extract",
		{
			config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
			schema: {
				body: {
					type: "object",
					required: ["token"],
					additionalProperties: false,
					properties: {
						token: { type: "string", minLength: 16 },
					},
				},
			},
		},
		authController.googleExtract,
	);

	fastify.post(
		"/send-code",
		{
			config: { rateLimit: { max: 3, timeWindow: "1 minute" } },
			schema: {
				body: {
					type: "object",
					required: ["email"],
					additionalProperties: false,
					properties: {
						email: { type: "string", format: "email" },
					},
				},
			},
		},
		authController.sendCode,
	);

	fastify.post(
		"/link-google",
		{
			preHandler: checkAuth,
			config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
			schema: {
				body: {
					type: "object",
					required: ["token"],
					additionalProperties: false,
					properties: {
						token: { type: "string", minLength: 16 },
					},
				},
			},
		},
		authController.linkGoogle,
	);
}
