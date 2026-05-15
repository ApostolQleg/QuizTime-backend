import User from "../user.model.js";

export const findById = async (userId) => {
	return await User.findById(userId);
};

export const findPublicById = async (userId) => {
	return await User.findById(userId).select("nickname avatarUrl themeColor avatarType");
};

export const updateById = async (userId, updates) => {
	return await User.findByIdAndUpdate(userId, { $set: updates }, { new: true });
};

export const save = async (user) => {
	return await user.save();
};

export const deleteById = async (userId) => {
	return await User.findByIdAndDelete(userId);
};

export const existsByNickname = async (nickname) => {
	return await User.exists({ nickname });
};
