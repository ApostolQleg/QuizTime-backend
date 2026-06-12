import { User } from "#src/modules/user/index.js";

export const findUserByEmail = async (email) => {
	return User.findOne({ email });
};

export const findUserByGoogleId = async (googleId) => {
	return User.findOne({ googleId });
};

export const findUserById = async (userId) => {
	return User.findById(userId);
};

export const existsUserByNickname = async (nickname) => {
	return Boolean(await User.exists({ nickname }));
};

export const createUser = async (payload) => {
	const user = new User(payload);
	await user.save();
	return user;
};

export const saveUser = async (user) => {
	await user.save();
	return user;
};
