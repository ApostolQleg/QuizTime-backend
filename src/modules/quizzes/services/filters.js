import * as persistenceService from "#src/modules/quizzes/services/persistence.js";

export const filter = async (authorId, limit, skip, search, sort) => {
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

	return await persistenceService.findQuizzes({ limit, skip, filter, sort: sortQuery });
};
