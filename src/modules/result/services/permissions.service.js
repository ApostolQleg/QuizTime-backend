import {
	InvalidResultPayloadError,
	QuizNotFoundError,
	ResultForbiddenError,
	ResultNotFoundError,
	ResultValidationError,
} from "../errors/result.error.js";

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

export const assertAnswersMatchQuiz = ({ quiz, answers, summary }) => {
	if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
		throw new ResultValidationError("Quiz has no questions");
	}

	if (answers.length !== quiz.questions.length) {
		throw new ResultValidationError("Answers count must match quiz questions count");
	}

	if (summary?.total !== quiz.questions.length) {
		throw new ResultValidationError("Summary total must match quiz questions count");
	}

	for (const [questionIndex, selectedOptionIds] of answers.entries()) {
		if (!Array.isArray(selectedOptionIds)) {
			throw new ResultValidationError(
				`Answers for question ${questionIndex} must be an array`,
			);
		}

		const question = quiz.questions[questionIndex];
		const optionIds = new Set((question?.options || []).map((option) => option?.id));

		if (optionIds.size === 0) {
			throw new ResultValidationError(`Quiz question ${questionIndex} has no options`);
		}

		if (selectedOptionIds.length > optionIds.size) {
			throw new ResultValidationError(
				`Too many selected answers for question ${questionIndex}`,
			);
		}

		const uniqueSelected = new Set(selectedOptionIds);
		if (uniqueSelected.size !== selectedOptionIds.length) {
			throw new ResultValidationError(
				`Duplicate selected answers for question ${questionIndex}`,
			);
		}

		for (const selectedOptionId of selectedOptionIds) {
			if (!optionIds.has(selectedOptionId)) {
				throw new ResultValidationError(
					`Invalid selected option for question ${questionIndex}`,
				);
			}
		}
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
