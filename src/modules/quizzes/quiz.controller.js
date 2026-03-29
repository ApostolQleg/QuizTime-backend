import * as services from "./quiz.services.js";

export const getAllQuizzes = async (request, reply) => {
	const limit = parseInt(request.query.limit) || 36;
	const skip = parseInt(request.query.skip) || 0;
	const searchParam = request.query.search || "";
	const sortParam = request.query.sort || "newest";
	const authorId = request.query.authorId || "";

	const data = await services.getAllQuizzes(limit, skip, searchParam, sortParam, authorId);

	reply.send(data);
};

export const createQuiz = async (request, reply) => {
	const userId = request.userId;
	const { id, title, description, questions } = request.body;

	const data = await services.createQuiz(userId, id, title, description, questions);
	if (!data.ok) return reply.code(400).send(data);

	reply.code(201).send(data);
};

export const getQuizById = async (request, reply) => {
	const id = request.params.id;

	const data = await services.getQuizById(id);
	if (!data.ok) return reply.code(404).send({ error: "Quiz not found" });

	reply.send(data);
};

export const updateQuiz = async (request, reply) => {
	const userId = request.userId;
	const id = request.params.id;
	const { title, description, questions } = request.body;

	const data = await services.updateQuiz(userId, id, title, description, questions);
	if (!data.ok) return reply.code(400).send(data);

	reply.send(data);
};

export const deleteQuiz = async (request, reply) => {
	const userId = request.userId;
	const id = request.params.id;

	const data = await services.deleteQuiz(userId, id);
	if (!data.ok) return reply.code(400).send(data);

	reply.send(data);
};
