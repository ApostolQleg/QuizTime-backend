import User from "../../users/user.model.js";

export const findUserById = async (userId) => {
	return User.findById(userId);
};
