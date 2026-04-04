import { DomainError } from "../../../errors/domain-error.js";

export class QuizValidationError extends DomainError {
	constructor(message, details) {
		super(message, 400, "QUIZ_VALIDATION_ERROR", details);
	}
}

export class InvalidQuizPayloadError extends QuizValidationError {
	constructor() {
		super("Invalid payload");
	}
}

export class QuizQuestionsRequiredError extends QuizValidationError {
	constructor() {
		super("Quiz must have at least one question");
	}
}

export class QuestionsMustBeArrayError extends QuizValidationError {
	constructor() {
		super("Questions must be an array");
	}
}

export class QuizAlreadyExistsError extends DomainError {
	constructor(message = "Quiz with this id already exists") {
		super(message, 409, "QUIZ_ALREADY_EXISTS");
	}
}

export class QuizNotFoundError extends DomainError {
	constructor(message = "Quiz not found") {
		super(message, 404, "QUIZ_NOT_FOUND");
	}
}

export class QuizAuthorNotFoundError extends DomainError {
	constructor(message = "Author not found") {
		super(message, 404, "QUIZ_AUTHOR_NOT_FOUND");
	}
}

export class CannotEditSystemQuizError extends DomainError {
	constructor() {
		super("Cannot edit system quizzes", 403, "QUIZ_EDIT_FORBIDDEN");
	}
}

export class CannotDeleteSystemQuizError extends DomainError {
	constructor() {
		super("Cannot delete system quizzes", 403, "QUIZ_DELETE_FORBIDDEN");
	}
}

export class QuizAuthorMismatchError extends DomainError {
	constructor(message = "You are not the author") {
		super(message, 403, "QUIZ_AUTHOR_FORBIDDEN");
	}
}
