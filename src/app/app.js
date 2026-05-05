import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import dotenv from "dotenv";
import Fastify from "fastify";
import router from "#src/app/http/router.js";
import { seedQuizzesIfEmpty } from "#src/data/quizSeed.js";
import { connectToDatabase } from "#src/infrastructure/db/db.js";
import errorHandlerPlugin from "#src/plugins/error-handler.js";

dotenv.config();

export const app = Fastify({
	logger: true,
	trustProxy: true,
	connectionTimeout: 20000,
});

await app.register(cors, {
	origin: [
		"https://quiz-time-with-react.vercel.app",
		"http://localhost:5173",
		"http://127.0.0.1:5173",
		"http://localhost:5174",
		"http://127.0.0.1:5174",
	],
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
});

await app.register(rateLimit, { global: false });
await app.register(errorHandlerPlugin);

app.register(async (instance) => {
	try {
		await connectToDatabase();
		await seedQuizzesIfEmpty();
		instance.log.info("MongoDB connection established via Plugin");
	} catch (err) {
		instance.log.error("Database connection failed", err);
		throw err;
	}
});

app.register(router);

// Serverless function for Vercel
export default async function handler(req, res) {
	await app.ready();
	app.server.emit("request", req, res);
}
