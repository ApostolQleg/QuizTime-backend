import * as quizService from "../services/quiz.js";

export const getAllQuizzes = async (request, reply) => {
	const limit = parseInt(request.query.limit) || 36;
	const skip = parseInt(request.query.skip) || 0;
	const search = request.query.search || "";
	const sort = request.query.sort || "newest";
	const authorId = request.query.authorId || "";

	const data = await quizService.getAllQuizzes({ authorId, limit, skip, search, sort });
	return reply.send({ success: true, ...data });
};

export const getQuizById = async (request, reply) => {
	const { id } = request.params;

	const data = await quizService.getQuizById({ id });
	return reply.send({ success: true, ...data });
};

export const createQuiz = async (request, reply) => {
	const userId = request.userId;
	const { id, title, description, questions } = request.body;

	const data = await quizService.createQuiz({ userId, id, title, description, questions });
	return reply.send({ success: true, ...data });
};

export const updateQuiz = async (request, reply) => {
	const userId = request.userId;
	const { id } = request.params;
	const { title, description, questions } = request.body;

	const data = await quizService.updateQuiz({ userId, id, title, description, questions });
	return reply.send({ success: true, ...data });
};

export const deleteQuiz = async (request, reply) => {
	const userId = request.userId;
	const { id } = request.params;
    
	const data = await quizService.deleteQuiz({ userId, id });
	return reply.send({ success: true, ...data });
};
