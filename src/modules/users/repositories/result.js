import Result from "../../results/result.model.js";

export const deleteByUserId = async (userId) => {
	return await Result.deleteMany({ userId });
};