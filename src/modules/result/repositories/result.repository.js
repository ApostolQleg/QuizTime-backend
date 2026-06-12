import Result from "../result.model.js";

export const findResultById = async (id) => {
	return Result.findById(id).populate("quizId", "title category tags questions").lean();
};

export const createResult = async (payload) => {
	const result = new Result(payload);
	await result.save();

	return await result.populate({
		path: "quizId",
		select: "title category tags questions",
	});
};

export const findResults = async ({ limit, skip, filter, sort }) => {
	return Result.find(filter)
		.sort(sort)
		.skip(skip)
		.limit(limit)
		.populate({
			path: "quizId",
			select: "title category tags",
		})
		.lean();
};

export const findResultsByPipeline = async (pipeline) => {
	return Result.aggregate(pipeline);
};
