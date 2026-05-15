import { User } from "#src/modules/users/index.js";

export const findUserById = async (userId) => {
	return User.findById(userId);
};
