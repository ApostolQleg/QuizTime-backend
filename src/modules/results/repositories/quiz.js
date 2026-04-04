import { Quiz } from "../index.js";

export const findById = async (id) => {
	return Quiz.findOne({ id }).lean();
};
