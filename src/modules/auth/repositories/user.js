import User from "#src/modules/users/user.model.js";

export const findByEmail = async (email) => {
	return User.findOne({ email });
};

export const findByGoogleId = async (googleId) => {
	return User.findOne({ googleId });
};

export const findById = async (userId) => {
	return User.findById(userId);
};

export const existsByNickname = async (nickname) => {
	return Boolean(await User.exists({ nickname }));
};

export const create = async (payload) => {
	const user = new User(payload);
	await user.save();
	return user;
};

export const save = async (user) => {
	await user.save();
	return user;
};
