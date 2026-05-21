import Result from "../result.model.js";

export const findResultById = async (id) => {
	return Result.findById(id).populate("quizId").lean();
};

export const createResult = async (payload) => {
	const result = new Result(payload);
	await result.save();

	return await result.populate("quizId");
};

export const findResults = async ({ limit, skip, filter, sort }) => {
	return Result.find(filter)
		.sort(sort)
		.skip(skip)
		.limit(limit)
		.populate({
			path: "quizId",
			select: "-questions",
		})
		.lean();
};

export const findResultsByPipeline = async (pipeline) => {
	return Result.aggregate(pipeline);
};
