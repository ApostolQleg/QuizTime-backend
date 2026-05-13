import Quiz from "#src/modules/quizzes/quiz.model.js";

export const findById = async (id) => {
	return await Quiz.findById(id).populate({
		path: "authorId",
		select: "nickname avatarUrl avatarType themeColor",
	});
};

export const updateById = async (id, updates) => {
	return await Quiz.findByIdAndUpdate(id, { $set: updates }, { new: true });
};

export const deleteById = async (id) => {
	return await Quiz.findByIdAndDelete(id);
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
		.select("_id title category tags questions authorId")
		.populate({
			path: "authorId",
			select: "nickname",
		});
};
