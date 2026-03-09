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
	fastify.addHook("preHandler", checkAuth);

	fastify.get("/", getUser);
	fastify.get("/users/:id", getUserById);
	fastify.put("/update", updateProfile);
	fastify.post("/password", changePassword);
	fastify.delete("/delete", deleteAccount);
	fastify.get("/nickname", getNicknameArray);
}
