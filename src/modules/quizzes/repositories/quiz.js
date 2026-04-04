import Quiz from "#src/modules/quizzes/quiz.model.js";

export const findById = async (id) => {
	return await Quiz.findOne({ id });
};

export const updateById = async (id, updates) => {
	return await Quiz.findOneAndUpdate({ id }, { $set: updates }, { new: true });
};

export const deleteById = async (id) => {
	return await Quiz.findOneAndDelete({ id });
};

export const create = async (payload) => {
	const quiz = new Quiz(payload);
	await quiz.save();
	return quiz;
};

export const filteredQuizzes = async (limit, skip, filter, sort) => {
	return await Quiz.find(filter)
		.collation({ locale: "uk", strength: 2 })
		.sort(sort)
		.skip(skip)
		.limit(limit)
		.select("id title description questions authorId createdAt")
		.populate("authorId", "nickname avatarUrl avatarType themeColor");
};
