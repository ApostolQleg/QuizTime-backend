import TempCode from "../temp-code.model.js";

export const findTempCodeByEmail = async (email) => {
	return TempCode.findOne({ email });
};

export const upsertTempCodeByEmail = async (email, code) => {
	return TempCode.findOneAndUpdate(
		{ email },
		{ code, createdAt: new Date() },
		{ upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
	);
};

export const deleteTempCodeByEmail = async (email) => {
	return TempCode.deleteOne({ email });
};
