import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";
import { getGmail } from "../lib";

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
    const { pageToken } = args;
    const gmail = getGmail(config);

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
