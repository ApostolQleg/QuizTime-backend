import { sendVerificationEmail } from "#src/infrastructure/email/email.service.js";
import {
	InvalidVerificationCodeError,
	VerificationCodeExpiredError,
} from "#src/modules/auth/errors/auth.js";
import * as tempCodeRepository from "#src/modules/auth/repositories/temp-code.js";

const generateVerificationCode = () => {
	return Math.floor(100000 + Math.random() * 900000).toString();
};

export const findByEmail = async (email) => {
	return tempCodeRepository.findByEmail(email);
};

export const issueForEmail = async (email) => {
	const code = generateVerificationCode();

	await tempCodeRepository.upsertByEmail(email, code);

	await sendVerificationEmail(email, code);

	return { message: "Code sent" };
};

export const verifyCode = async (email, code) => {
	const record = await findByEmail(email);

	if (!record) {
		throw new VerificationCodeExpiredError();
	}

	if (record.code !== code.trim()) {
		throw new InvalidVerificationCodeError();
	}

	await tempCodeRepository.deleteByEmail(email);
};
