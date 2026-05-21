import mongoose from "mongoose";

export const buildResultsFilter = ({ userId, search = "" }) => {
	const pipeline = [
		{ $match: { userId: new mongoose.Types.ObjectId(userId) } },
		{
			$lookup: {
				from: "quizzes",
				localField: "quizId",
				foreignField: "_id",
				as: "quizInfo",
			},
		},
		{
			$unwind: { path: "$quizInfo", preserveNullAndEmptyArrays: true },
		},
	];

	if (search) {
		const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		pipeline.push({
			$match: {
				"quizInfo.title": { $regex: escapedSearch, $options: "i" },
			},
		});
	}

	return pipeline;
};

export const buildResultsSort = (sort = "newest") => {
	let sortOrder = { _id: -1 };
	if (sort === "oldest") sortOrder = { _id: 1 };
	if (sort === "az") sortOrder = { "quizInfo.title": 1, _id: -1 };
	if (sort === "za") sortOrder = { "quizInfo.title": -1, _id: -1 };
	return { $sort: sortOrder };
};
