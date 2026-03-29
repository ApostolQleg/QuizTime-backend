import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { User } from "../users/index.js";
import { TempCode } from "./index.js";
import { generateNickname } from "../../shared/utils/nicknameGen.js";
import { verifyGoogleToken } from "../../infrastructure/google/googleClient.js";
import { sendVerificationEmail } from "../../infrastructure/email/email.service.js";

export const getUniqueNickname = async () => {
	let candidate = generateNickname().next().value;
	let exists = await User.exists({ nickname: candidate });

	while (exists) {
		candidate = generateNickname().next().value;
		exists = await User.exists({ nickname: candidate });
	}
	return candidate;
};

export const generateOAuthPasswordHash = async () => {
	const randomPassword = crypto.randomBytes(32).toString("hex");
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(randomPassword, salt);
};

export const register = async (request, reply) => {
	try {
		const { email, password, avatarUrl, code, googleToken } = request.body;

		if (!email || !password) {
			return reply.code(400).send({ error: "Email and password are required" });
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return reply.code(409).send({ error: "User with this email already exists" });
		}

		let googleId = null;
		let nickname = generateNickname().next().value;
		let finalAvatarUrl = avatarUrl;

		if (googleToken) {
			const payload = await verifyGoogleToken(googleToken);

			if (payload.email !== email) {
				return reply
					.code(400)
					.send({ error: "Google email does not match provided email" });
			}

			googleId = payload.sub;
			if (!finalAvatarUrl) finalAvatarUrl = payload.picture;
		} else {
			if (!code) {
				return reply.code(400).send({ error: "Verification code is required" });
			}

			const record = await TempCode.findOne({ email });
			if (!record) {
				return reply
					.code(400)
					.send({ error: "Verification code expired or not found. Please try again." });
			}

			if (record.code !== code.trim()) {
				return reply.code(400).send({ error: "Invalid verification code" });
			}

			await TempCode.deleteOne({ email });
		}

		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);

		const user = new User({
			email,
			nickname,
			passwordHash,
			avatarUrl: finalAvatarUrl,
			googleId,
		});

		await user.save();

		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
		const { passwordHash: _, ...userData } = user.toObject();
		reply.code(201).send({ ok: true, user: userData, token });
	} catch (error) {
		console.error("Register error:", error);
		reply.code(500).send({ error: "Registration failed" });
	}
};

export const login = async (request, reply) => {
	try {
		const { email, password } = request.body;

		const user = await User.findOne({ email: email });

		if (!user) return reply.code(404).send({ error: "User not found" });

		const isValidPass = await bcrypt.compare(password, user.passwordHash);
		if (!isValidPass) return reply.code(400).send({ error: "Invalid password" });

		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
		const { passwordHash: _, ...userData } = user.toObject();
		reply.send({ ok: true, user: userData, token });
	} catch (error) {
		console.error("Login error:", error);
		reply.code(500).send({ error: "Login failed" });
	}
};

export const googleAuth = async (request, reply) => {
	try {
		const { token } = request.body;

		const payload = await verifyGoogleToken(token);
		const { email, sub, picture } = payload;

		let user = await User.findOne({ email });

		if (!user) {
			user = new User({
				email,
				nickname: await services.getUniqueNickname(),
				passwordHash: await generateOAuthPasswordHash(),
				googleId: sub,
				avatarUrl: picture,
				avatarType: picture ? "google" : "generated",
			});

			await user.save();
		}

		let hasChanges = false;

		if (!user.nickname) {
			user.nickname = await services.getUniqueNickname();
			hasChanges = true;
		}

		if (!user.googleId) {
			user.googleId = sub;
			hasChanges = true;
		}

		if (!user.avatarUrl && picture) {
			user.avatarUrl = picture;
			user.avatarType = "google";
			hasChanges = true;
		}

		if (hasChanges) {
			await user.save();
		}

		const appToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
		const { passwordHash: _, ...userData } = user.toObject();
		reply.send({ ok: true, user: userData, token: appToken });
	} catch (error) {
		console.error("Google Auth Error:", error);
		reply.code(500).send({ error: "Google authentication failed" });
	}
};

export const googleExtract = async (request, reply) => {
	try {
		const { token } = request.body;

		const payload = await verifyGoogleToken(token);
		const { email, picture, sub } = payload;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return reply.code(409).send({ error: "User with this email already exists" });
		}

		reply.send({ ok: true, email, picture, googleId: sub });
	} catch (error) {
		console.error("Google Extract Error:", error);
		reply.code(500).send({ error: "Invalid Google Token" });
	}
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
