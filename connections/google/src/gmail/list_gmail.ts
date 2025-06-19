import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const listGmailMessagesWithServiceAccount: Tool = {
  name: "listGmailMessagesWithServiceAccount",
  userDescription:
    "List the user's Gmail messages in pages of 10 using a service account with delegated access.",
  aiDescription:
    "Lists Gmail messages for a user in pages of 10 using service account impersonation.",
  arguments: [
    {
      name: "pageToken",
      type: "string",
      userDescription:
        "Optional page token to continue from the previous result page.",
      aiDescription: "Token to fetch the next page of messages (optional).",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson, userEmail } = config;
    const { pageToken } = args;

    let credentials;
    try {
      credentials = JSON.parse(serviceAccountJson);
    } catch (e) {
      return {
        results: {},
        log: {
          message: "Invalid service account JSON",
          data: e,
        },
      };
    }

    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
      subject: userEmail, // Impersonation
    });

    const gmail = google.gmail({ version: "v1", auth });

    try {
      const res = await gmail.users.messages.list({
        userId: "me",
        maxResults: 10,
        pageToken,
      });

      return {
        results: {
          messages: res.data.messages ?? [],
          nextPageToken: res.data.nextPageToken ?? null,
        },
        log: {
          message: `Fetched ${res.data.messages?.length ?? 0} Gmail messages.`,
          data: res.data,
        },
      };
    } catch (err) {
      return {
        results: {},
        log: {
          message: "Failed to list Gmail messages",
          data: err,
        },
      };
    }
  },
};
