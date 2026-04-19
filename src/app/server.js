import { app } from "#src/app/app.js"

// Local development server
if (process.env.NODE_ENV !== "production") {
	const PORT = process.env.PORT || 3000;
	try {
		await app.ready();
		app.listen({ port: PORT });
		console.log(`Server running on port ${PORT}`);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
}

// Export handler for Vercel
export { default } from "#src/app/app.js";
