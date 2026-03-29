import { User } from "./index.js";
import { Result } from "../results/index.js";
import { generateNickname } from "../../shared/utils/nicknameGen.js";
import * as services from "./user.services.js";

export const getUser = async (request, reply) => {
	const user = await User.findById(request.userId);
	if (!user) {
		return reply.code(404).send({ ok: false, error: "User is not found" });
	}

	const data = services.getUserData(user);

	return reply.send(data);
};

export const getUserById = async (request, reply) => {
	const user = await User.findById(request.params.id).select(
		"nickname avatarUrl themeColor avatarType",
	);
	if (!user) {
		return reply.code(404).send({ ok: false, error: "User is not found" });
	}

	const data = services.getUserDataById(user);

	return reply.send(data);
};

export const changePassword = async (request, reply) => {
	const user = await User.findById(request.userId);
	if (!user) {
		return reply.code(404).send({ ok: false, error: "User is not found" });
	}

	const { currentPassword, newPassword } = request.body;

	const data = await services.changePassword(user, currentPassword, newPassword);
	if (!data.ok) {
		return reply.code(400).send(data);
	}

	return reply.send(data);
};

export const updateProfile = async (request, reply) => {
	const user = await User.findById(request.userId);
	if (!user) {
		return reply.code(404).send({ ok: false, error: "User is not found" });
	}

	const { nickname, themeColor, avatarType } = request.body;

	const data = await services.updateProfile(user, nickname, themeColor, avatarType);

	return reply.send(data);
};

export const deleteAccount = async (request, reply) => {
	const deletedUser = await User.findByIdAndDelete(request.userId);

	if (!deletedUser) {
		return reply.code(404).send({ error: "User not found" });
	}

	await services.deleteAccount(request.userId);

	return reply.send({ ok: true, message: "Account deleted successfully" });
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
