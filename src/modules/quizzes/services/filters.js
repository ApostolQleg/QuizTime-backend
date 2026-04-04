import * as quizRepository from "../repositories/quiz.js";

export const filter = async (limit, skip, search, sort, authorId) => {
	let filter = {};
	if (authorId) filter.authorId = authorId;
	if (search) {
		const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		filter.title = { $regex: escapedSearch, $options: "i" };
	}

	let sortQuery = { createdAt: -1 };
	if (sort === "oldest") sortQuery = { createdAt: 1 };
	else if (sort === "az") sortQuery = { title: 1, createdAt: -1 };
	else if (sort === "za") sortQuery = { title: -1, createdAt: -1 };

	return await quizRepository.filteredQuizzes(limit, skip, filter, sortQuery);
};
