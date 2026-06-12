import { checkAuth } from "#src/shared/middleware/checkAuth.js";
import * as userController from "./controllers/user.controller.js";
import {
	changePasswordSchema,
	getCurrentUserSchema,
	getNicknameSuggestionsSchema,
	updateProfileSchema,
} from "./schemas/user.schema.js";

export default async function userRoutes(fastify) {
	fastify.get(
		"/:id",
		{
			schema: getCurrentUserSchema,
			config: { rateLimit: { max: 60, timeWindow: "1 minute" } },
		},
		userController.getUserById,
	);

	fastify.register(async (protectedRoutes) => {
		protectedRoutes.addHook("preHandler", checkAuth);
		protectedRoutes.get(
			"/",
			{ config: { rateLimit: { max: 60, timeWindow: "1 minute" } } },
			userController.getCurrentUser,
		);
		protectedRoutes.put(
			"/update",
			{
				schema: updateProfileSchema,
				config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
			},
			userController.updateProfile,
		);

		protectedRoutes.post(
			"/password",
			{
				schema: changePasswordSchema,
				config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
			},
			userController.changePassword,
		);
		protectedRoutes.delete(
			"/delete",
			{ config: { rateLimit: { max: 5, timeWindow: "1 minute" } } },
			userController.deleteAccount,
		);
		protectedRoutes.get(
			"/nickname",
			{
				schema: getNicknameSuggestionsSchema,
				config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
			},
			userController.getNicknameSuggestions,
		);
	});
}
