import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../users/index.js";
import { TempCode } from "./index.js";
import { generateNickname } from "../../shared/utils/nicknameGen.js";
import { verifyGoogleToken } from "../../infrastructure/google/googleClient.js";
import { sendVerificationEmail } from "../../infrastructure/email/email.service.js";
import * as services from "./auth.services.js";

export const register = async (request, reply) => {
	const { email, password, avatarUrl, code, googleToken } = request.body;
	const data = await services.register(email, password, avatarUrl, code, googleToken);
	if (!data.ok) return reply.code(400).send(data);
	reply.code(201).send(data);
};

export const login = async (request, reply) => {
	const { email, password } = request.body;
	const data = await services.login(email, password);
	if (!data.ok) return reply.code(400).send(data);
	reply.send(data);
};

export const googleAuth = async (request, reply) => {
	const { token } = request.body;
	const data = await services.googleAuth(token);
	reply.send(data);
};

export const googleExtract = async (request, reply) => {
	const { token } = request.body;
	const data = await services.googleExtract(token);
	if (!data.ok) return reply.code(400).send(data);
	reply.send(data);
};

export const sendCode = async (request, reply) => {
	try {
		const { email } = request.body;
		if (!email) return reply.code(400).send({ error: "Email is required" });

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return reply.code(409).send({ error: "User with this email already exists" });
		}

		const code = Math.floor(100000 + Math.random() * 900000).toString();

		await TempCode.findOneAndUpdate(
			{ email },
			{ code, createdAt: new Date() },
			{ upsert: true, new: true, setDefaultsOnInsert: true },
		);

		await sendVerificationEmail(email, code);

		reply.send({ ok: true, message: "Code sent" });
	} catch (error) {
		console.error("Send code error:", error);
		reply.code(500).send({ error: "Failed to send verification code" });
	}
};

export const linkGoogle = async (request, reply) => {
	try {
		const userId = request.userId;

		const { token } = request.body;

		const payload = await verifyGoogleToken(token);
		const { sub, picture } = payload;

		const existingGoogleUser = await User.findOne({ googleId: sub });
		if (existingGoogleUser && String(existingGoogleUser._id) !== String(userId)) {
			return reply
				.code(409)
				.send({ error: "This Google account is already linked to another user" });
		}

		const user = await User.findById(userId);
		if (!user) return reply.code(404).send({ error: "User not found" });

		user.googleId = sub;

		if (!user.avatarUrl) {
			user.avatarUrl = picture;
			user.avatarType = "google";
		}

		await user.save();

		const { passwordHash, ...userData } = user.toObject();
		reply.send({ ok: true, user: userData });
	} catch (error) {
		console.error("Link Google Error:", error);
		reply.code(500).send({ error: "Failed to link Google account" });
	}
};
