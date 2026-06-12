import { Result } from "#src/modules/result/index.js";

export const deleteByUserId = async (userId) => {
	return Result.deleteMany({ userId });
};
