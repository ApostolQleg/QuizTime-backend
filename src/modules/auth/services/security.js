import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const TOKEN_EXPIRES_IN = "30d";

export const hashPassword = async (plainPassword) => {
	return Bun.password.hash(plainPassword);
};

export const verifyPassword = async (plainPassword, passwordHash) => {
	return Bun.password.verify(plainPassword, passwordHash);
};

export const generateOAuthPasswordHash = async () => {
	const randomPassword = crypto.randomBytes(32).toString("hex");
	return hashPassword(randomPassword);
};

export const signAccessToken = (userId) => {
	return jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
		expiresIn: TOKEN_EXPIRES_IN,
	});
};
