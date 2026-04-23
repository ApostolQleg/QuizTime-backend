import Result from "#src/modules/results/result.model.js";

export const findById = async (id) => {
	return Result.findOne({ _id: id }).lean();
};

export const create = async (payload) => {
	const result = new Result(payload);
	await result.save();
	return result;
};

export const filteredResults = async (limit, skip, filter, sort) => {
	return Result.find(filter).select("-questions").sort(sort).skip(skip).limit(limit).lean();
};
