import {
	CurrentPasswordIncorrectError,
	UserNotFoundError,
} from "#src/modules/users/errors/user.js";
import * as userRepository from "#src/modules/users/repositories/user.js";

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
