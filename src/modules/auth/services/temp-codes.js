import TempCode from "../temp-code.model.js";
import { sendVerificationEmail } from "../../../infrastructure/email/email.service.js";

const generateVerificationCode = () => {
	return Math.floor(100000 + Math.random() * 900000).toString();
};

export const findByEmail = async (email) => {
	return TempCode.findOne({ email });
};

export const issueForEmail = async (email) => {
	const code = generateVerificationCode();

	await TempCode.findOneAndUpdate(
		{ email },
		{ code, createdAt: new Date() },
		{ upsert: true, new: true, setDefaultsOnInsert: true },
	);

	await sendVerificationEmail(email, code);

	return { message: "Code sent" };
};

export const verifyCode = async (email, code) => {
	const record = await findByEmail(email);

	if (!record) {
		return {
			ok: false,
			errorType: "NOT_FOUND",
			error: "Verification code expired or not found. Please try again.",
		};
	}

	if (record.code !== code.trim()) {
		return { ok: false, errorType: "VALIDATION", error: "Invalid verification code" };
	}

	await TempCode.deleteOne({ email });
	return { ok: true };
};
