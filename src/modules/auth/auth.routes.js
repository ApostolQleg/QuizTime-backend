import { authService } from "./index.js";
import { checkAuth } from "../../shared/middleware/checkAuth.js";

export default async function authRoutes(fastify) {
	fastify.post("/register", authService.register);
	fastify.post("/login", authService.login);
	fastify.post("/google", authService.googleAuth);
	fastify.post("/google-extract", authService.googleExtract);
	fastify.post("/send-code", authService.sendCode);
	fastify.post("/link-google", { preHandler: checkAuth }, authService.linkGoogle);
}
