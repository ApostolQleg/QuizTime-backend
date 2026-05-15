import Quiz from "../quiz.model.js";

export const findQuizById = async (id) => {
	return await Quiz.findById(id).populate({
		path: "authorId",
		select: "nickname avatarUrl avatarType themeColor",
	});
};

export const updateQuizById = async (id, updates) => {
	return await Quiz.findByIdAndUpdate(id, { $set: updates }, { new: true });
};

export const deleteQuizById = async (id) => {
	return await Quiz.findByIdAndDelete(id);
};

export const createQuiz = async (payload) => {
	const quiz = new Quiz(payload);
	await quiz.save();
	return quiz;
};

export const findQuizzes = async ({ limit, skip, filter, sort }) => {
	return await Quiz.find(filter)
		.collation({ locale: "uk", strength: 2 })
		.sort(sort)
		.skip(skip)
		.limit(limit)
		.select("_id title category tags questions authorId")
		.populate({
			path: "authorId",
			select: "nickname",
		});
};
