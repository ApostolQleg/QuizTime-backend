import { EventEmitter } from "node:events";

export const EventSSE = new EventEmitter();
EventSSE.setMaxListeners(0);

const pingInterval = setInterval(() => emitPingSSE(), 20000);
pingInterval.unref();

export function emitPingSSE() {
	EventSSE.emit("SSE_EVENT", "event: PING\n\n");
}

export function emitCreateQuizSSE(quiz) {
	EventSSE.emit("SSE_EVENT", `event: CREATE_QUIZ\ndata: ${JSON.stringify(quiz)}\n\n`);
}

export function emitUpdateQuizSSE(quiz) {
	EventSSE.emit("SSE_EVENT", `event: UPDATE_QUIZ\ndata: ${JSON.stringify(quiz)}\n\n`);
}

export function emitDeleteQuizSSE(quizId) {
	EventSSE.emit("SSE_EVENT", `event: DELETE_QUIZ\ndata: ${quizId}\n\n`);
}
