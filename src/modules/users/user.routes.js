import { userService } from "./index.js";
import { checkAuth } from "../../shared/middleware/checkAuth.js";

export default async function userRoutes(fastify) {
	// public routes
	fastify.get(
		"/:id",
		{
			schema: {
				params: {
					type: "object",
					required: ["id"],
					additionalProperties: false,
					properties: {
						id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
					},
				},
			},
		},
		userService.getUserById,
	);

	// protected routes
	fastify.register(async function (protectedRoutes) {
		protectedRoutes.addHook("preHandler", checkAuth);
		protectedRoutes.get("/", userService.getUser);
		protectedRoutes.put(
			"/update",
			{
				schema: {
					body: {
						type: "object",
						additionalProperties: false,
						properties: {
							login: { type: "string", minLength: 2, maxLength: 64 },
							nickname: { type: "string", minLength: 2, maxLength: 64 },
							themeColor: { type: "string", maxLength: 32 },
							avatarType: { type: "string", maxLength: 32 },
						},
						anyOf: [
							{ required: ["login"] },
							{ required: ["nickname"] },
							{ required: ["themeColor"] },
							{ required: ["avatarType"] },
						],
					},
				},
			},
			userService.updateProfile,
		);

		protectedRoutes.post(
			"/password",
			{
				schema: {
					body: {
						type: "object",
						required: ["currentPassword", "newPassword"],
						additionalProperties: false,
						properties: {
							currentPassword: { type: "string", minLength: 1, maxLength: 128 },
							newPassword: { type: "string", minLength: 6, maxLength: 128 },
						},
					},
				},
			},
			userService.changePassword,
		);
		protectedRoutes.delete("/delete", userService.deleteAccount);
		protectedRoutes.get("/nickname", userService.getNicknameArray);
	});
}
