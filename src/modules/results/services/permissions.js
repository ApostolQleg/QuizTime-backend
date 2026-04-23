import {
	InvalidResultPayloadError,
	QuizNotFoundError,
	ResultForbiddenError,
	ResultNotFoundError,
	ResultValidationError,
} from "#src/modules/results/errors/result.js";

export const assertUserId = (userId) => {
	if (!userId) {
		throw new ResultValidationError("User ID missing");
	}
};

export const assertValidSavePayload = ({ userId, quizId, answers, summary }) => {
	assertUserId(userId);

	if (!quizId || !answers || !summary) {
		throw new InvalidResultPayloadError();
	}

	if (!Array.isArray(answers) || answers.length === 0) {
		throw new InvalidResultPayloadError();
	}

	if (!summary || typeof summary !== "object") {
		throw new InvalidResultPayloadError();
	}
};

export const assertQuizExists = (quiz) => {
	if (!quiz) {
		throw new QuizNotFoundError();
	}
};

export const assertResultExists = (result) => {
	if (!result) {
		throw new ResultNotFoundError();
	}
};

export const assertCanAccessResult = (result, userId) => {
	if (String(result.userId) !== String(userId)) {
		throw new ResultForbiddenError();
	}
};
