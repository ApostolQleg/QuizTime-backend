import { userService } from "./index.js";
import { checkAuth } from "../../shared/middleware/checkAuth.js";

export default async function userRoutes(fastify) {
	// public routes
	fastify.get("/:id", userService.getUserById);

	// protected routes
	fastify.register(async function (protectedRoutes) {
		protectedRoutes.addHook("preHandler", checkAuth);
		protectedRoutes.get("/", userService.getUser);
		protectedRoutes.put("/update", userService.updateProfile);
		protectedRoutes.post("/password", userService.changePassword);
		protectedRoutes.delete("/delete", userService.deleteAccount);
		protectedRoutes.get("/nickname", userService.getNicknameArray);
	});
}
