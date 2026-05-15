import { checkAuth } from "#src/shared/middleware/checkAuth.js";
import * as userController from "./controllers/user.controller.js";
import {
	changePasswordSchema,
	getCurrentUserSchema,
	getNicknameSuggestionsSchema,
	updateProfileSchema,
} from "./schemas/user.schema.js";

export default async function userRoutes(fastify) {
	fastify.get("/:id", { schema: getCurrentUserSchema }, userController.getUserById);

	fastify.register(async (protectedRoutes) => {
		protectedRoutes.addHook("preHandler", checkAuth);
		protectedRoutes.get("/", userController.getCurrentUser);
		protectedRoutes.put(
			"/update",
			{ schema: updateProfileSchema },
			userController.updateProfile,
		);

		protectedRoutes.post(
			"/password",
			{ schema: changePasswordSchema },
			userController.changePassword,
		);
		protectedRoutes.delete("/delete", userController.deleteAccount);
		protectedRoutes.get(
			"/nickname",
			{ schema: getNicknameSuggestionsSchema },
			userController.getNicknameSuggestions,
		);
	});
}
