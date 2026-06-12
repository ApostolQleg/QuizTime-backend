import { User } from "#src/modules/user/index.js";

export const findUserById = async (userId) => {
	return User.findById(userId);
};
