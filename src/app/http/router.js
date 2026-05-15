import { authRoutes } from "#src/modules/auth/index.js";
import { eventRoutes } from "#src/modules/events/index.js";
import { quizRoutes } from "#src/modules/quizzes/index.js";
import { resultRoutes } from "#src/modules/results/index.js";
import { userRoutes } from "#src/modules/users/index.js";

export default async function router(app) {
	app.register(authRoutes, { prefix: "/auth" });
	app.register(quizRoutes, { prefix: "/api/quizzes" });
	app.register(resultRoutes, { prefix: "/api/results" });
	app.register(userRoutes, { prefix: "/api/user" });
	app.register(eventRoutes, { prefix: "/api/events" });
}
