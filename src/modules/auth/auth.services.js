import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { User } from "../users/index.js";
import { TempCode } from "./index.js";
import { generateNickname } from "../../shared/utils/nicknameGen.js";
import { verifyGoogleToken } from "../../infrastructure/google/googleClient.js";
import { sendVerificationEmail } from "../../infrastructure/email/email.service.js";

const getUniqueNickname = async () => {
	let candidate = generateNickname().next().value;
	let exists = await User.exists({ nickname: candidate });

	while (exists) {
		candidate = generateNickname().next().value;
		exists = await User.exists({ nickname: candidate });
	}
	return candidate;
};

const generateOAuthPasswordHash = async () => {
	const randomPassword = crypto.randomBytes(32).toString("hex");
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(randomPassword, salt);
};

export const register = async (email, password, avatarUrl, code, googleToken) => {
	if (!email || !password) {
		return { ok: false, error: "Email and password are required", code: 400 };
	}

	const existingEmail = await User.findOne({ email });
	if (existingEmail) {
		return { ok: false, error: "User with this email already exists", code: 409 };
	}

	let googleId = null;
	let nickname = generateNickname().next().value;
	let finalAvatarUrl = avatarUrl;

	if (googleToken) {
		const payload = await verifyGoogleToken(googleToken);

		if (payload.email !== email) {
			return { ok: false, error: "Google email does not match provided email", code: 401 };
		}

		googleId = payload.sub;
		if (!finalAvatarUrl) finalAvatarUrl = payload.picture;
	} else {
		if (!code) {
			return { ok: false, error: "Verification code is required", code: 400 };
		}

		const record = await TempCode.findOne({ email });
		if (!record) {
			return {
				ok: false,
				error: "Verification code expired or not found. Please try again.",
				code: 404,
			};
		}

		if (record.code !== code.trim()) {
			return { ok: false, error: "Invalid verification code", code: 400 };
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
	return { ok: true, user: userData, token, code: 201 };
};

export const login = async (email, password) => {
	const user = await User.findOne({ email: email });

	if (!user) return { ok: false, error: "User not found", code: 404 };

	const isValidPass = await bcrypt.compare(password, user.passwordHash);
	if (!isValidPass) return { ok: false, error: "Invalid password", code: 401 };

	const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
	const { passwordHash: _, ...userData } = user.toObject();
	return { ok: true, user: userData, token, code: 200 };
};

export const googleAuth = async (token) => {
	const payload = await verifyGoogleToken(token);
	const { email, sub, picture } = payload;

	let user = await User.findOne({ email });

	if (!user) {
		user = new User({
			email,
			nickname: await getUniqueNickname(),
			passwordHash: await generateOAuthPasswordHash(),
			googleId: sub,
			avatarUrl: picture,
			avatarType: picture ? "google" : "generated",
		});

		await user.save();
	}

	let hasChanges = false;

	if (!user.nickname) {
		user.nickname = await getUniqueNickname();
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

	return { ok: true, user: userData, token: appToken, code: 200 };
};

export const googleExtract = async (token) => {
	const payload = await verifyGoogleToken(token);
	const { email, picture, sub } = payload;

	const existingUser = await User.findOne({ email });

	if (existingUser) {
		return { ok: false, error: "User with this email already exists", code: 409 };
	}

	return { ok: true, email, picture, googleId: sub, code: 200 };
};

export const sendCode = async (email) => {
	if (!email) return { ok: false, error: "Email is required", code: 400 };

	const existingUser = await User.findOne({ email });
	if (existingUser) return { ok: false, error: "User with this email already exists", code: 409 };

	const code = Math.floor(100000 + Math.random() * 900000).toString();

	await TempCode.findOneAndUpdate(
		{ email },
		{ code, createdAt: new Date() },
		{ upsert: true, new: true, setDefaultsOnInsert: true },
	);

	await sendVerificationEmail(email, code);

	return { ok: true, message: "Code sent", code: 200 };
};

export const linkGoogle = async (userId, token) => {
	const payload = await verifyGoogleToken(token);
	const { sub, picture } = payload;

	const existingGoogleUser = await User.findOne({ googleId: sub });
	if (existingGoogleUser && String(existingGoogleUser._id) !== String(userId)) {
		return {
			ok: false,
			error: "This Google account is already linked to another user",
			code: 409,
		};
	}

	const user = await User.findById(userId);
	if (!user) return { ok: false, error: "User not found", code: 404 };

	user.googleId = sub;

	if (!user.avatarUrl) {
		user.avatarUrl = picture;
		user.avatarType = "google";
	}

	await user.save();

	const { passwordHash, ...userData } = user.toObject();
	return { ok: true, user: userData, code: 200 };
};
