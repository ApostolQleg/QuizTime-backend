import {
	CannotDeleteSystemQuizError,
	CannotEditSystemQuizError,
	InvalidQuizPayloadError,
	QuestionsMustBeArrayError,
	QuizAlreadyExistsError,
	QuizAuthorMismatchError,
	QuizAuthorNotFoundError,
	QuizNotFoundError,
	QuizQuestionsRequiredError,
} from "#src/modules/quizzes/errors/quiz.js";

export const assertValidCreatePayload = ({ id, title, questions }) => {
	if (!id || !title?.trim()) {
		throw new InvalidQuizPayloadError();
	}

	if (!Array.isArray(questions) || questions.length === 0) {
		throw new QuizQuestionsRequiredError();
	}
};

export const assertQuizNotExists = (quiz) => {
	if (quiz) {
		throw new QuizAlreadyExistsError();
	}
};

export const assertAuthorExists = (user) => {
	if (!user) {
		throw new QuizAuthorNotFoundError();
	}
};

export const assertQuizExists = (quiz) => {
	if (!quiz) {
		throw new QuizNotFoundError();
	}
};

export const assertCanEditQuiz = (quiz, userId) => {
	if (!quiz.authorId) {
		throw new CannotEditSystemQuizError();
	}

	if (String(quiz.authorId) !== String(userId)) {
		throw new QuizAuthorMismatchError();
	}
};

export const assertCanDeleteQuiz = (quiz, userId) => {
	if (!quiz.authorId) {
		throw new CannotDeleteSystemQuizError();
	}

	if (String(quiz.authorId) !== String(userId)) {
		throw new QuizAuthorMismatchError();
	}
};

export const assertValidQuestionsForUpdate = (questions) => {
	if (questions !== undefined && !Array.isArray(questions)) {
		throw new QuestionsMustBeArrayError();
	}
};
