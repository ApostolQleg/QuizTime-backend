import { app } from "#src/app/app.js";

const PORT = process.env.PORT || 3000;

try {
	await app.ready();
	await app.listen({ port: PORT, host: "0.0.0.0" });
	console.log(`Server running on port ${PORT}`);
} catch (err) {
	app.log.error(err);
	process.exit(1);
}
