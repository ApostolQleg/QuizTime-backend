import { DomainError } from "#src/errors/domain-error.js";

const formatValidationDetails = (validation = []) => {
	return validation.map((item) => ({
		field: item.instancePath || item.params?.missingProperty || "",
		message: item.message,
		keyword: item.keyword,
	}));
};

export default async function errorHandlerPlugin(fastify) {
	fastify.setErrorHandler((error, request, reply) => {
		if (error instanceof DomainError) {
			return reply.status(error.statusCode).send({
				success: false,
				error: error.errorCode,
				message: error.message,
				details: error.details,
			});
		}

		if (error.validation) {
			return reply.status(400).send({
				success: false,
				error: "VALIDATION_ERROR",
				message: "Request validation failed",
				details: {
					context: error.validationContext,
					issues: formatValidationDetails(error.validation),
				},
			});
		}

		request.log.error(error);

		return reply.status(500).send({
			success: false,
			error: "INTERNAL_SERVER_ERROR",
			message: "Internal Server Error",
		});
	});
}
