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
	const { email } = request.body;
	const data = await services.sendCode(email);
	if (!data.ok) return reply.code(400).send(data);
	reply.send(data);
};

export const linkGoogle = async (request, reply) => {
	const userId = request.userId;
	const { token } = request.body;

	const data = await services.linkGoogle(userId, token);
	if (!data.ok) return reply.code(400).send(data);
	
	reply.send(data);
};
