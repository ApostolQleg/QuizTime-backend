import User from "#src/modules/users/user.model.js";

export const findUserById = async (userId) => {
	return User.findById(userId);
};
