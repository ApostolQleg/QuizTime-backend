import * as filtersService from "./filters.service.js";
import * as normalizationService from "./normalization.service.js";
import * as permissionService from "./permissions.service.js";
import * as persistenceService from "./persistence.service.js";

export const getAllResults = async ({ userId, limit, skip, search, sort }) => {
	permissionService.assertUserId(userId);

	const deferLookup = !search && sort !== "az" && sort !== "za";
	const filterStages = filtersService.buildResultsFilter({ userId, search, deferLookup });
	const sortStage = filtersService.buildResultsSort(sort);

	const lateLookupStages = deferLookup ? filtersService.getResultsLookupStages() : [];

	const pipeline = [
		...filterStages,
		sortStage,
		{ $skip: skip },
		{ $limit: limit },
		...lateLookupStages,
		{
			$project: {
				_id: 1,
				quizId: 1,
				summary: 1,
				userId: 1,
				quizInfo: 1,
			},
		},
	];

	const results = await persistenceService.findResultsByPipeline(pipeline);
	return { results: normalizationService.normalizeResultList(results) };
};

export const createResult = async ({ userId, quizId, answers, summary }) => {
	permissionService.assertValidSavePayload({
		userId,
		quizId,
		answers,
		summary,
	});

	const quiz = await persistenceService.findQuizById(quizId);
	permissionService.assertQuizExists(quiz);

	const payload = normalizationService.buildSaveResultPayload({
		userId,
		quizId,
		answers,
		summary,
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
