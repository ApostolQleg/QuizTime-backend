export const sanitizeUser = (user) => {
	const { passwordHash, ...userData } = user.toObject();
	return userData;
};

export const resolveRegisterIdentity = ({ avatarUrl, googleProfile }) => {
	if (!googleProfile) {
		return { googleId: null, finalAvatarUrl: avatarUrl };
	}

	return {
		googleId: googleProfile.googleId,
		finalAvatarUrl: avatarUrl || googleProfile.picture,
	};
};

export const buildGoogleExtractPayload = (googleProfile) => {
	return {
		email: googleProfile.email,
		picture: googleProfile.picture,
		googleId: googleProfile.googleId,
	};
};
