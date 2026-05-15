import { UserNotFoundError } from "../errors/user.error.js";
import * as resultRepository from "../repositories/result.repository.js";
import * as userRepository from "../repositories/user.repository.js";

export const deleteAccount = async ({ userId }) => {
	const user = await userRepository.deleteUserById(userId);
	if (!user) {
		throw new UserNotFoundError();
	}

	await resultRepository.deleteByUserId(userId);

	return { message: "Account deleted successfully" };
};
