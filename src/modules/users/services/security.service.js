import { CurrentPasswordIncorrectError, UserNotFoundError } from "../errors/user.error.js";
import * as userRepository from "../repositories/user.repository.js";

export const changePassword = async ({ userId, currentPassword, newPassword }) => {
	const user = await userRepository.findById(userId);
	if (!user) {
		throw new UserNotFoundError();
	}

	const isMatch = await user.comparePassword(currentPassword);
	if (!isMatch) {
		throw new CurrentPasswordIncorrectError();
	}

	const passwordHash = await Bun.password.hash(newPassword);
	await userRepository.updateById(userId, { passwordHash });

	return { message: "Password changed successfully" };
};
