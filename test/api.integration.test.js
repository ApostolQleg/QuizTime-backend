import test, { before, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

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
	await Promise.all([User.deleteMany({}), Quiz.deleteMany({}), Result.deleteMany({})]);
});

after(async () => {
	await app.close();
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await mongod.stop();
});

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

test("GET /api/results/:id only returns current user's result", async () => {
	const alice = await User.create({
		email: "alice@example.com",
		nickname: "alice_nick",
		passwordHash: "hash1",
	});

	const bob = await User.create({
		email: "bob@example.com",
		nickname: "bob_nick",
		passwordHash: "hash2",
	});

	const quiz = await Quiz.create({
		id: "quiz-ownership-1",
		title: "Ownership Quiz",
		description: "Test",
		questions: [{ q: "2+2?", options: ["4"], answer: 0 }],
		authorId: alice._id,
		authorName: "alice_nick",
	});

	const aliceResult = await Result.create({
		quizId: quiz.id,
		quizTitle: quiz.title,
		summary: { score: 1, correct: 1, total: 1 },
		answers: [{ selected: 0 }],
		questions: quiz.questions,
		userId: alice._id,
	});

	const bobToken = jwt.sign({ _id: bob._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

	const response = await app.inject({
		method: "GET",
		url: `/api/results/${aliceResult._id}`,
		headers: {
			authorization: `Bearer ${bobToken}`,
		},
	});

	assert.equal(response.statusCode, 404);
	assert.equal(response.json().error, "Result not found");
});

test("POST /api/results accepts answers as numeric array", async () => {
	const user = await User.create({
		email: "poster@example.com",
		nickname: "poster_nick",
		passwordHash: "hash3",
	});

	const quiz = await Quiz.create({
		id: "quiz-post-1",
		title: "Posting Quiz",
		description: "Post test",
		questions: [{ q: "2+2?", options: ["3", "4"], answer: 1 }],
		authorId: user._id,
		authorName: "poster_nick",
	});

	const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

	const response = await app.inject({
		method: "POST",
		url: "/api/results",
		headers: {
			authorization: `Bearer ${token}`,
		},
		payload: {
			quizId: quiz.id,
			answers: [1],
			summary: { score: 1, correct: 1, total: 1 },
			timestamp: new Date().toISOString(),
		},
	});

	assert.equal(response.statusCode, 201);
	assert.equal(response.json().ok, true);
});

test("POST /api/results accepts timestamp as unix milliseconds", async () => {
	const user = await User.create({
		email: "poster2@example.com",
		nickname: "poster2_nick",
		passwordHash: "hash4",
	});

	const quiz = await Quiz.create({
		id: "quiz-post-2",
		title: "Posting Quiz 2",
		description: "Post test 2",
		questions: [{ q: "2+3?", options: ["4", "5"], answer: 1 }],
		authorId: user._id,
		authorName: "poster2_nick",
	});

	const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

	const response = await app.inject({
		method: "POST",
		url: "/api/results",
		headers: {
			authorization: `Bearer ${token}`,
		},
		payload: {
			quizId: quiz.id,
			answers: [1],
			summary: { score: 1, correct: 1, total: 1 },
			timestamp: Date.now(),
		},
	});

	assert.equal(response.statusCode, 201);
	assert.equal(response.json().ok, true);
});
