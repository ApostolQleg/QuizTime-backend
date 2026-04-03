import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const TOKEN_EXPIRES_IN = "30d";

export const hashPassword = async (plainPassword) => {
	const salt = await bcrypt.genSalt(SALT_ROUNDS);
	return bcrypt.hash(plainPassword, salt);
};

export const verifyPassword = async (plainPassword, passwordHash) => {
	return bcrypt.compare(plainPassword, passwordHash);
};

export const generateOAuthPasswordHash = async () => {
	const randomPassword = crypto.randomBytes(32).toString("hex");
	return hashPassword(randomPassword);
};

export const signAccessToken = (userId) => {
	return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
};
