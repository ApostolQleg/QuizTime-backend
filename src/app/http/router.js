import authRoutes from "../../routes/authRoutes.js";
import userRoutes from "../../routes/userRoutes.js";
import quizRoutes from "../../routes/quizRoutes.js";
import resultRoutes from "../../routes/resultRoutes.js";

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