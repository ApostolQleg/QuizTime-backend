import { EventEmitter } from "node:events";

export const EventSSE = new EventEmitter();
EventSSE.setMaxListeners(0);

setInterval(() => emitPingSSE(), 20000);

export function emitPingSSE() {
    EventSSE.emit("SSE_EVENT", "event: PING\n\n");
}

export function emitCreateQuizSSE(quizId) {
    EventSSE.emit("SSE_EVENT", `event: CREATE_QUIZ\ndata: ${quizId}\n\n`);
}

export function emitUpdateQuizSSE(quizId) {
    EventSSE.emit("SSE_EVENT", `event: UPDATE_QUIZ\ndata: ${quizId}\n\n`);
}
