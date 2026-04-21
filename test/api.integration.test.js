import assert from "node:assert/strict";
import test, { after, before, beforeEach } from "node:test";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod;
let app;
let User;
let Quiz;
let Result;

before(async () => {
	mongod = await MongoMemoryServer.create();
	process.env.MONGO_URI = mongod.getUri();
	process.env.JWT_SECRET = "test-jwt-secret";
	process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
	process.env.SMTP_USER = "test@example.com";
	process.env.SMTP_PASS = "test-smtp-pass";
	process.env.NODE_ENV = "test";

	const appModule = await import("#src/app/app.js");
	const usersModule = await import("#src/modules/users/index.js");
	const quizzesModule = await import("#src/modules/quizzes/index.js");
	const resultsModule = await import("#src/modules/results/index.js");

	app = appModule.app;
	User = usersModule.User;
	Quiz = quizzesModule.Quiz;
	Result = resultsModule.Result;

	await app.ready();
});

beforeEach(async () => {
	await Promise.all([
		User.deleteMany({}),
		Quiz.deleteMany({}),
		Result.deleteMany({}),
	]);
});

after(async () => {
	await app.close();
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await mongod.stop();
});

const createUserAndToken = async ({ email, nickname, passwordHash }) => {
	const user = await User.create({ email, nickname, passwordHash });
	const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});

	return { user, token };
};

test("GET / returns health payload", async () => {
	const response = await app.inject({
		method: "GET",
		url: "/",
	});

	assert.equal(response.statusCode, 200);
	const body = response.json();
	assert.equal(typeof body.status, "string");
	assert.ok(body.status.includes("Server is running"));
});

test("GET /api/results without token is rejected", async () => {
	const response = await app.inject({
		method: "GET",
		url: "/api/results",
	});

	assert.equal(response.statusCode, 403);
	assert.equal(response.json().error, "No access");
});

test("quizzes lifecycle: create and delete by author", async () => {
	const { user: author, token: authorToken } = await createUserAndToken({
		email: "author@example.com",
		nickname: "author_nick",
		passwordHash: "hash-author",
	});

	const quizPayload = {
		id: "quiz-lifecycle-1",
		title: "Lifecycle Quiz",
		description: "Integration lifecycle quiz",
		questions: [{ q: "2+2?", options: ["3", "4"], answer: 1 }],
	};

	const createResponse = await app.inject({
		method: "POST",
		url: "/api/quizzes",
		headers: { authorization: `Bearer ${authorToken}` },
		payload: quizPayload,
	});

	assert.equal(createResponse.statusCode, 201);
	const createBody = createResponse.json();
	assert.equal(createBody.success, true);
	assert.equal(createBody.quiz.id, quizPayload.id);
	assert.equal(createBody.quiz.authorName, author.nickname);
	assert.equal(String(createBody.quiz.authorId), String(author._id));

	const storedQuiz = await Quiz.findOne({ id: quizPayload.id }).lean();
	assert.ok(storedQuiz);

	const deleteResponse = await app.inject({
		method: "DELETE",
		url: `/api/quizzes/${quizPayload.id}`,
		headers: { authorization: `Bearer ${authorToken}` },
	});

	assert.equal(deleteResponse.statusCode, 200);
	const deleteBody = deleteResponse.json();
	assert.equal(deleteBody.success, true);
	assert.equal(deleteBody.message, "Quiz deleted successfully");

	const deletedQuiz = await Quiz.findOne({ id: quizPayload.id }).lean();
	assert.equal(deletedQuiz, null);
});

test("results lifecycle: pass quiz and read own result", async () => {
	const { token: authorToken } = await createUserAndToken({
		email: "author2@example.com",
		nickname: "author2_nick",
		passwordHash: "hash-author-2",
	});

	const { user: player, token: playerToken } = await createUserAndToken({
		email: "player@example.com",
		nickname: "player_nick",
		passwordHash: "hash-player",
	});

	const quizId = "quiz-pass-1";
	await app.inject({
		method: "POST",
		url: "/api/quizzes",
		headers: { authorization: `Bearer ${authorToken}` },
		payload: {
			id: quizId,
			title: "Passable Quiz",
			description: "Quiz for result passing",
			questions: [{ q: "3+3?", options: ["5", "6"], answer: 1 }],
		},
	});

	const passResponse = await app.inject({
		method: "POST",
		url: "/api/results",
		headers: { authorization: `Bearer ${playerToken}` },
		payload: {
			quizId,
			answers: [1],
			summary: { score: 1, correct: 1, total: 1 },
			createdAt: Date.now(),
		},
	});

	assert.equal(passResponse.statusCode, 201);
	const passBody = passResponse.json();
	assert.equal(passBody.success, true);
	assert.equal(passBody.result.quizId, quizId);
	assert.equal(passBody.result.quizTitle, "Passable Quiz");
	assert.equal(String(passBody.result.userId), String(player._id));
	assert.ok(passBody.result.createdAt);
	assert.equal("timestamp" in passBody.result, false);

	const listResponse = await app.inject({
		method: "GET",
		url: "/api/results",
		headers: { authorization: `Bearer ${playerToken}` },
	});

	assert.equal(listResponse.statusCode, 200);
	const listBody = listResponse.json();
	assert.equal(listBody.success, true);
	assert.equal(Array.isArray(listBody.results), true);
	assert.equal(listBody.results.length, 1);
	assert.equal(listBody.results[0].quizId, quizId);
	assert.equal("timestamp" in listBody.results[0], false);

	const ownResultResponse = await app.inject({
		method: "GET",
		url: `/api/results/${passBody.result._id}`,
		headers: { authorization: `Bearer ${playerToken}` },
	});

	assert.equal(ownResultResponse.statusCode, 200);
	assert.equal(ownResultResponse.json().success, true);

	const forbiddenResponse = await app.inject({
		method: "GET",
		url: `/api/results/${passBody.result._id}`,
		headers: { authorization: `Bearer ${authorToken}` },
	});

	assert.equal(forbiddenResponse.statusCode, 403);
	const forbiddenBody = forbiddenResponse.json();
	assert.ok(["RESULT_FORBIDDEN", "Forbidden"].includes(forbiddenBody.error));
	if (forbiddenBody.message !== undefined) {
		assert.equal(forbiddenBody.message, "Forbidden");
	}
});

test("users lifecycle: delete account removes user and owned results", async () => {
	const { token: authorToken } = await createUserAndToken({
		email: "author3@example.com",
		nickname: "author3_nick",
		passwordHash: "hash-author-3",
	});

	const { user: player, token: playerToken } = await createUserAndToken({
		email: "player2@example.com",
		nickname: "player2_nick",
		passwordHash: "hash-player-2",
	});

	await app.inject({
		method: "POST",
		url: "/api/quizzes",
		headers: { authorization: `Bearer ${authorToken}` },
		payload: {
			id: "quiz-pass-2",
			title: "Cleanup Quiz",
			description: "Quiz for account cleanup",
			questions: [{ q: "5+5?", options: ["10", "11"], answer: 0 }],
		},
	});

	const passResponse = await app.inject({
		method: "POST",
		url: "/api/results",
		headers: { authorization: `Bearer ${playerToken}` },
		payload: {
			quizId: "quiz-pass-2",
			answers: [0],
			summary: { score: 1, correct: 1, total: 1 },
		},
	});

	assert.equal(passResponse.statusCode, 201);

	const beforeDeleteResultsCount = await Result.countDocuments({
		userId: player._id,
	});
	assert.equal(beforeDeleteResultsCount, 1);

	const deleteUserResponse = await app.inject({
		method: "DELETE",
		url: "/api/user/delete",
		headers: { authorization: `Bearer ${playerToken}` },
	});

	assert.equal(deleteUserResponse.statusCode, 200);
	const deleteUserBody = deleteUserResponse.json();
	assert.equal(deleteUserBody.success, true);
	assert.equal(deleteUserBody.message, "Account deleted successfully");

	const deletedUser = await User.findById(player._id).lean();
	assert.equal(deletedUser, null);

	const afterDeleteResultsCount = await Result.countDocuments({
		userId: player._id,
	});
	assert.equal(afterDeleteResultsCount, 0);

	const accessAfterDeleteResponse = await app.inject({
		method: "GET",
		url: "/api/results",
		headers: { authorization: `Bearer ${playerToken}` },
	});

	assert.equal(accessAfterDeleteResponse.statusCode, 401);
	assert.equal(
		accessAfterDeleteResponse.json().error,
		"User deleted or disabled",
	);
});
