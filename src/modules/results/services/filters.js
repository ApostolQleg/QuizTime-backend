export const buildResultsFilter = ({ userId, search = "" }) => {
	const filter = { userId };

	if (search) {
		const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		filter.quizTitle = { $regex: escapedSearch, $options: "i" };
	}

	return filter;
};

export const buildResultsSort = (sort = "newest") => {
	if (sort === "oldest") return { createdAt: 1 };
	if (sort === "az") return { quizTitle: 1, createdAt: -1 };
	if (sort === "za") return { quizTitle: -1, createdAt: -1 };

	return { createdAt: -1 };
};
