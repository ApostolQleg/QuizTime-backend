import * as filtersService from "#src/modules/results/services/filters.js";
import * as normalizationService from "#src/modules/results/services/normalization.js";
import * as permissionService from "#src/modules/results/services/permissions.js";
import * as persistenceService from "#src/modules/results/services/persistence.js";

export const getAllResults = async ({ userId, limit, skip, search, sort }) => {
	permissionService.assertUserId(userId);

	const filter = filtersService.buildResultsFilter({ userId, search });
	const sortQuery = filtersService.buildResultsSort(sort);
	const results = await persistenceService.findResults({ filter, sort: sortQuery, skip, limit });

	return { results: normalizationService.normalizeResultList(results) };
};

export const createResult = async ({ userId, quizId, answers, summary, createdAt }) => {
	permissionService.assertValidSavePayload({ userId, quizId, answers, summary });

	const quiz = await persistenceService.findQuizById(quizId);
	permissionService.assertQuizExists(quiz);

	const payload = normalizationService.buildSaveResultPayload({
		userId,
		quizId,
		quiz,
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
