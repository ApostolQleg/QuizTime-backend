import bcrypt from "bcrypt";
import User from "../models/User.js";
import Result from "../models/Result.js";
import { generateNickname } from "../utils/nicknameGen.js";

// Get current user logic
export const getUser = async (request, reply) => {
	try {
		const user = await User.findById(request.userId);

		if (!user) {
			return reply.code(404).send({ error: "User not found" });
		}

		return reply.send({
			ok: true,
			user: {
				_id: user._id,
				login: user.login,
				email: user.email,
				nickname: user.nickname,
				avatarUrl: user.avatarUrl,
				themeColor: user.themeColor,
				avatarType: user.avatarType,
				googleId: user.googleId,
			},
		});
	} catch (error) {
		return reply.code(500).send({ error: "Failed to fetch user" });
	}
};

export const getUserById = async (request, reply) => {
	try {
		const user = await User.findById(request.params.id).select("nickname avatarUrl themeColor avatarType");

		if (!user) {
			return reply.code(404).send({ error: "User not found" });
		}

		return reply.send({
			ok: true,
			user: {
				nickname: user.nickname,
				avatarUrl: user.avatarUrl,
				themeColor: user.themeColor,
				avatarType: user.avatarType,
			},
		});
	} catch (error) {
		return reply.code(500).send({ error: "Failed to fetch user" });
	}
};

// Change password logic
export const changePassword = async (request, reply) => {
	try {
		const { currentPassword, newPassword } = request.body;
		if (!currentPassword || !newPassword) {
			return reply.code(400).send({ error: "Current and new passwords are required" });
		}

		const user = await User.findById(request.userId);
		if (!user) {
			return reply.code(404).send({ error: "User not found" });
		}

		const isMatch = await user.comparePassword(currentPassword);
		if (!isMatch) {
			return reply.code(400).send({ error: "Current password is incorrect" });
		}

		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(newPassword, salt);
		user.passwordHash = passwordHash;

		await user.save();

		return reply.send({ ok: true, message: "Password changed successfully" });
	} catch (error) {
		console.error("Change password error:", error);
		return reply.code(500).send({ error: "Failed to change password" });
	}
};

// Profile update logic
export const updateProfile = async (request, reply) => {
	try {
		const { login, nickname, themeColor, avatarType } = request.body;

		const user = await User.findById(request.userId);

		if (!user) {
			return reply.code(404).send({ error: "User not found" });
		}

		if (login) user.login = login;
		if (nickname) user.nickname = nickname;
		if (themeColor) user.themeColor = themeColor;
		if (avatarType) user.avatarType = avatarType;

		await user.save();

		const { passwordHash, ...userData } = user.toObject();

		return reply.send({
			ok: true,
			user: userData,
		});
	} catch (error) {
		console.error("Profile update error:", error);
		return reply.code(500).send({ error: "Failed to update profile" });
	}
};

// Delete account logic
export const deleteAccount = async (request, reply) => {
	try {
		const deletedUser = await User.findByIdAndDelete(request.userId);

		if (!deletedUser) {
			return reply.code(404).send({ error: "User not found" });
		}

		await Result.deleteMany({ userId: request.userId });

		return reply.send({ ok: true, message: "Account deleted successfully" });
	} catch (error) {
		console.error("Delete account error:", error);
		return reply.code(500).send({ error: "Failed to delete account" });
	}
};

export const getNicknameArray = async (request, reply) => {
	try {
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

		return reply.send({ ok: true, nicknames: nicknameArray });
	} catch (error) {
		console.error("Get nickname array error:", error);
		return reply.code(500).send({ error: "Failed to get nickname array" });
	}
};
