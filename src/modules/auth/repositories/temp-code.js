import TempCode from "#src/modules/auth/temp-code.model.js";

export const findByEmail = async (email) => {
	return TempCode.findOne({ email });
};

export const upsertByEmail = async (email, code) => {
	return TempCode.findOneAndUpdate(
		{ email },
		{ code, createdAt: new Date() },
		{ upsert: true, new: true, setDefaultsOnInsert: true },
	);
};

export const deleteByEmail = async (email) => {
	return TempCode.deleteOne({ email });
};
