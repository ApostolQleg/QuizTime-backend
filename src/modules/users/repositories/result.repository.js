import { Result } from "#src/modules/results/index.js";

export const deleteByUserId = async (userId) => {
	return Result.deleteMany({ userId });
};
