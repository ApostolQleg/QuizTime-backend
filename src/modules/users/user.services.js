import bcrypt from "bcrypt";
import { User } from "./index.js";
import { Result } from "../results/index.js";
import { generateNickname } from "../../shared/utils/nicknameGen.js";

export const getUserData = async (userId) => {
	const user = await User.findById(userId);
	if (!user) return { ok: false, error: "User not found", code: 404 };

	return {
		ok: true,
		code: 200,
		user: {
			_id: user._id,
			email: user.email,
			nickname: user.nickname,
			avatarUrl: user.avatarUrl,
			themeColor: user.themeColor,
			avatarType: user.avatarType,
			googleId: user.googleId,
		},
	};
};

export const getUserDataById = async (userId) => {
	const user = await User.findById(userId).select("nickname avatarUrl themeColor avatarType");
	if (!user) return { ok: false, error: "User not found", code: 404 };

	return {
		ok: true,
		code: 200,
		user: {
			nickname: user.nickname,
			avatarUrl: user.avatarUrl,
			themeColor: user.themeColor,
			avatarType: user.avatarType,
		},
	};
};

export const changePassword = async (userId, currentPassword, newPassword) => {
	const user = await User.findById(userId);
	if (!user) return { ok: false, error: "User not found", code: 404 };

	const isMatch = await user.comparePassword(currentPassword);
	if (!isMatch) return { ok: false, error: "Current password is incorrect", code: 401 };

	const salt = await bcrypt.genSalt(10);
	const passwordHash = await bcrypt.hash(newPassword, salt);

	user.passwordHash = passwordHash;
	await user.save();

	return { ok: true, message: "Password changed successfully", code: 200 };
};

export const updateProfile = async (userId, nickname, themeColor, avatarType) => {
	const user = await User.findById(userId);
	if (!user) return { ok: false, error: "User not found", code: 404 };

	if (nickname) user.nickname = nickname;
	if (themeColor) user.themeColor = themeColor;
	if (avatarType) user.avatarType = avatarType;

	await user.save();

	const { passwordHash, ...userData } = user.toObject();

	return { ok: true, user: userData, code: 200 };
};

export const deleteAccount = async (userId) => {
	const user = await User.findByIdAndDelete(userId);
	if (!user) return { ok: false, error: "User not found", code: 404 };

	await Result.deleteMany({ userId: userId });

	return { ok: true, message: "Account deleted successfully", code: 200 };
};

export const getNicknameArray = async () => {
	const nicknameArray = [];
	const iterator = generateNickname();

	for (let i = 0; i < 14; i++) {
		const nickname = iterator.next().value;
		nicknameArray.push(nickname);
	}

	let isUnique = false;
	while (!isUnique) {
		const lastNickname = iterator.next().value;
		const isTaken = await User.exists({ nickname: lastNickname });
		nicknameArray.push(lastNickname);

		if (!isTaken) {
			isUnique = true;
		}
	}

	return { ok: true, nicknames: nicknameArray, code: 200 };
};
