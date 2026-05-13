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

export const assertValidCreatePayload = ({ title, tags, description, questions }) => {
	if (!title?.trim() || !description?.trim() || !Array.isArray(tags) || tags.length === 0) {
		throw new InvalidQuizPayloadError();
	}

	if (!Array.isArray(questions) || questions.length === 0) {
		throw new QuizQuestionsRequiredError();
	}
};

const getQuizAuthorId = (authorId) => {
	if (!authorId) return null;
	if (typeof authorId === "object") {
		return String(authorId._id ?? authorId);
	}

	return String(authorId);
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
	const quizAuthorId = getQuizAuthorId(quiz.authorId);

	if (!quizAuthorId) {
		throw new CannotEditSystemQuizError();
	}

	if (quizAuthorId !== String(userId)) {
		throw new QuizAuthorMismatchError();
	}
};

export const assertCanDeleteQuiz = (quiz, userId) => {
	const quizAuthorId = getQuizAuthorId(quiz.authorId);

	if (!quizAuthorId) {
		throw new CannotDeleteSystemQuizError();
	}

	if (quizAuthorId !== String(userId)) {
		throw new QuizAuthorMismatchError();
	}
};

export const assertValidQuestionsForUpdate = (questions) => {
	if (questions !== undefined && !Array.isArray(questions)) {
		throw new QuestionsMustBeArrayError();
	}
};
