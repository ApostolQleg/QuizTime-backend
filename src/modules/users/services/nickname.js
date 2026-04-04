import { generateNickname } from "#src/shared/utils/nicknameGen.js";
import * as userRepository from "#src/modules/users/repositories/user.js";

export const generateUniqueNickname = async () => {
	let candidate = generateNickname().next().value;
	let exists = await userRepository.existsByNickname(candidate);

	while (exists) {
		candidate = generateNickname().next().value;
		exists = await userRepository.existsByNickname(candidate);
	}

	return candidate;
};

export const buildNicknameArray = async () => {
	const nicknames = [];
	const iterator = generateNickname();

	for (let i = 0; i < 14; i++) {
		nicknames.push(iterator.next().value);
	}

	let isUnique = false;
	while (!isUnique) {
		const lastNickname = iterator.next().value;
		const isTaken = await userRepository.existsByNickname(lastNickname);
		nicknames.push(lastNickname);

		if (!isTaken) {
			isUnique = true;
		}
	}

	return { nicknames };
};
