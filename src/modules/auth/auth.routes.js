import { authService } from "./index.js";
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
		authService.register,
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
						email: { type: "string", minLength: 2, maxLength: 64 },
						password: { type: "string", minLength: 1, maxLength: 128 },
					},
				},
			},
		},
		authService.login,
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
		authService.googleAuth,
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
		authService.googleExtract,
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
		authService.sendCode,
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
		authService.linkGoogle,
	);
}
