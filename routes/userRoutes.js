import {
	getUser,
	changePassword,
	updateProfile,
	deleteAccount,
	getNicknameArray,
	getUserById,
} from "../controllers/userController.js";
import { checkAuth } from "../middleware/checkAuth.js";

export default async function userRoutes(fastify) {
	// public routes
	fastify.get("/users/:id", getUserById);

	// protected routes
	fastify.register(async function (protectedRoutes) {
		protectedRoutes.addHook("preHandler", checkAuth);
		protectedRoutes.get("/", getUser);
		protectedRoutes.put("/update", updateProfile);
		protectedRoutes.post("/password", changePassword);
		protectedRoutes.delete("/delete", deleteAccount);
		protectedRoutes.get("/nickname", getNicknameArray);
	});
}
