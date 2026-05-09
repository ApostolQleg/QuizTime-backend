import { EventEmitter } from "node:events";

const eventBus = new EventEmitter();

export const EVENTS = {
	QUIZ_COMPLETED: "quiz:completed",
};

export default eventBus;