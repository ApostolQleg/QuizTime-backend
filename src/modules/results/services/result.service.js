import * as filtersService from "./filters.service.js";
import * as normalizationService from "./normalization.service.js";
import * as permissionService from "./permissions.service.js";
import * as persistenceService from "./persistence.service.js";

export const getAllResults = async ({ userId, limit, skip, search, sort }) => {
	permissionService.assertUserId(userId);

	const filter = filtersService.buildResultsFilter({ userId, search });
	const sortQuery = filtersService.buildResultsSort(sort);
	const results = await persistenceService.findResults({
		filter,
		sort: sortQuery,
		skip,
		limit,
	});

	return { results: normalizationService.normalizeResultList(results) };
};

export const createResult = async ({
	userId,
	quizId,
	category,
	tags,
	answers,
	summary,
	createdAt,
}) => {
	permissionService.assertValidSavePayload({
		userId,
		quizId,
		category,
		tags,
		answers,
		summary,
	});

	const quiz = await persistenceService.findQuizById(quizId);
	permissionService.assertQuizExists(quiz);

	const payload = normalizationService.buildSaveResultPayload({
		userId,
		quizId,
		quiz,
		category,
		tags,
		answers,
		summary,
		createdAt,
	});

	const result = await persistenceService.createResult(payload);

	return { result: normalizationService.normalizeResultDetails(result) };
};

export const getResultById = async ({ id, userId }) => {
	permissionService.assertUserId(userId);

	const result = await persistenceService.findResultById(id);
	permissionService.assertResultExists(result);
	permissionService.assertCanAccessResult(result, userId);

	return { result: normalizationService.normalizeResultDetails(result) };
};
