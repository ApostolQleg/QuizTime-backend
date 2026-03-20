import { authRoutes } from "../../modules/auth/index.js";
import { userRoutes } from "../../modules/users/index.js";
import { quizRoutes } from "../../modules/quizzes/index.js";
import { resultRoutes } from "../../modules/results/index.js";

export default async function router(app, option) {
    // Health check route
    app.get("/", async (request, reply) => {
        return { status: "Server is running (Fastify)", time: new Date() };
    });

    // Route registration
    app.register(authRoutes, { prefix: "/auth" });
    app.register(quizRoutes, { prefix: "/api/quizzes" });
    app.register(resultRoutes, { prefix: "/api/results" });
    app.register(userRoutes, { prefix: "/api/user" });
}