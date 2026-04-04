import { userController } from "./index.js";
import { checkAuth } from "../../shared/middleware/checkAuth.js";
import {
	getCurrentUserSchema,
	updateProfileSchema,
	changePasswordSchema,
	getNicknameSuggestionsSchema,
} from "./schemas/user.js";

export default async function userRoutes(fastify) {
	fastify.get("/:id", { schema: getCurrentUserSchema }, userController.getUserById);

	fastify.register(async function (protectedRoutes) {
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
