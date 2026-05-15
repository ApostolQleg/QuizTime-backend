import User from "../user.model.js";

export const findUserById = async (userId) => {
	return await User.findById(userId);
};

export const findPublicUserById = async (userId) => {
	return await User.findById(userId).select("nickname avatarUrl themeColor avatarType");
};

export const updateUserById = async (userId, updates) => {
	return await User.findByIdAndUpdate(userId, { $set: updates }, { new: true });
};

export const saveUser = async (user) => {
	return await user.save();
};

export const deleteUserById = async (userId) => {
	return await User.findByIdAndDelete(userId);
};

export const existsUserByNickname = async (nickname) => {
	return await User.exists({ nickname });
};
