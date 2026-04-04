import bcrypt from "bcrypt";
import * as userRepository from "../repositories/user.js";
import { CurrentPasswordIncorrectError, UserNotFoundError } from "../errors/user.js";

export const changePassword = async ({ userId, currentPassword, newPassword }) => {
	const user = await userRepository.findById(userId);
	if (!user) {
		throw new UserNotFoundError();
	}

	const isMatch = await user.comparePassword(currentPassword);
	if (!isMatch) {
		throw new CurrentPasswordIncorrectError();
	}

	const salt = await bcrypt.genSalt(10);
	const passwordHash = await bcrypt.hash(newPassword, salt);
	await userRepository.updateById(userId, { passwordHash });

	return { message: "Password changed successfully" };
};
