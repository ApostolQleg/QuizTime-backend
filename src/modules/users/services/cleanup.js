import * as userRepository from "../repositories/user.js";
import * as resultRepository from "../repositories/result.js";
import { UserNotFoundError } from "../errors/user.js";

export const deleteAccount = async ({ userId }) => {
	const user = await userRepository.deleteById(userId);
	if (!user) {
		throw new UserNotFoundError();
	}

	await resultRepository.deleteByUserId(userId);

	return { message: "Account deleted successfully" };
};
