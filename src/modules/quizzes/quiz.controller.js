import { Quiz } from "./index.js";
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
	try {
		const quiz = await Quiz.findOne({ id: request.params.id });
		if (!quiz) return reply.code(404).send({ error: "Quiz not found" });

		if (!quiz.authorId) return reply.code(403).send({ error: "Cannot delete system quizzes" });

		if (String(quiz.authorId) !== String(request.userId)) {
			return reply.code(403).send({ error: "You are not the author" });
		}
		await Quiz.findOneAndDelete({ id: request.params.id });
		reply.send({ ok: true });
	} catch (error) {
		console.error("Delete quiz error:", error);
		reply.code(500).send({ error: "Failed to delete quiz" });
	}
};
