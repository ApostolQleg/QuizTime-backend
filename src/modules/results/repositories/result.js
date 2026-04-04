import Result from "../result.model.js";

export const findByIdAndUserId = async (id, userId) => {
	return Result.findOne({ _id: id, userId }).lean();
};

export const create = async (payload) => {
	const result = new Result(payload);
	await result.save();
	return result;
};

export const filteredResults = async (limit, skip, filter, sort) => {
	return Result.find(filter).select("-questions").sort(sort).skip(skip).limit(limit).lean();
};
