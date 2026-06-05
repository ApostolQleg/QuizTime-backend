import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const oAuth2Client = new OAuth2Client(
	process.env.GMAIL_CLIENT_ID,
	process.env.GMAIL_CLIENT_SECRET,
	"https://developers.google.com/oauthplayground",
);

oAuth2Client.setCredentials({
	refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

export const sendVerificationEmail = async (email, code) => {
	try {
		const accessTokenResponse = await oAuth2Client.getAccessToken();
		const accessToken = accessTokenResponse.token;

		if (!accessToken) {
			throw new Error("Failed to generate Google API Access Token");
		}

		const htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Welcome to QuizTime!</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #4CAF50; letter-spacing: 5px;">${code}</h1>
                <p style="color: #666; font-size: 12px;">This code expires in 5 minutes.</p>
            </div>
        `;

		const message = [
			`From: "QuizTime" <${process.env.SMTP_USER}>`,
			`To: ${email}`,
			"Content-Type: text/html; charset=utf-8",
			"MIME-Version: 1.0",
			"Subject: Your Verification Code",
			"",
			htmlContent,
		].join("\n");

		const encodedMessage = Buffer.from(message)
			.toString("base64")
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/, "");

		const response = await fetch(
			"https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ raw: encodedMessage }),
			},
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error?.message || "Failed to send email via Gmail API");
		}

		return await response.json();
	} catch (error) {
		console.error("=== [Gmail API Error]:", error);
		throw error;
	}
};
