import Result from "../result.model.js";

export const findResultById = async (id) => {
	return Result.findById(id).lean();
};

export const createResult = async (payload) => {
	const result = new Result(payload);
	await result.save();
	return result;
};

export const findResults = async ({ limit, skip, filter, sort }) => {
	return Result.find(filter).select("-questions").sort(sort).skip(skip).limit(limit).lean();
};
