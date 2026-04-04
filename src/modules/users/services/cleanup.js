import * as userRepository from "#src/modules/users/repositories/user.js";
import * as resultRepository from "#src/modules/users/repositories/result.js";
import { UserNotFoundError } from "#src/modules/users/errors/user.js";

export const deleteAccount = async ({ userId }) => {
	const user = await userRepository.deleteById(userId);
	if (!user) {
		throw new UserNotFoundError();
	}

	await resultRepository.deleteByUserId(userId);

	return { message: "Account deleted successfully" };
};
