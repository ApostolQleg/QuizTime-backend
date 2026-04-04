import { userController } from "./index.js";
import { checkAuth } from "../../shared/middleware/checkAuth.js";
import { getUserSchema, updateProfileSchema, changePasswordSchema } from "./schemas/user.js";

export default async function userRoutes(fastify) {
	fastify.get("/:id", { schema: getUserSchema }, userController.getUserById);

	fastify.register(async function (protectedRoutes) {
		protectedRoutes.addHook("preHandler", checkAuth);
		protectedRoutes.get("/", userController.getUser);
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
		protectedRoutes.get("/nickname", userController.getNicknameArray);
	});
}
