export const buildQuizzesFilter = ({ authorId, search = "" }) => {
	const filter = {};
	if (authorId) filter.authorId = authorId;
	if (search) {
		const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		filter.title = { $regex: escapedSearch, $options: "i" };
	}
	return filter;
};

export const buildQuizzesSort = (sort = "newest") => {
	if (sort === "oldest") return { _id: 1 };
	if (sort === "az") return { title: 1, _id: -1 };
	if (sort === "za") return { title: -1, _id: -1 };
	return { _id: -1 };
};
