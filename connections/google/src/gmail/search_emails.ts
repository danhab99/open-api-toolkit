import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const searchGmailMessagesWithServiceAccount: Tool = {
  name: "searchGmailMessagesWithServiceAccount",
  userDescription:
    "Search Gmail for messages using a query string and return up to 10 results.",
  aiDescription:
    "Searches a user's Gmail inbox using a search query string. Returns up to 10 emails.",
  arguments: [
    {
      name: "q",
      type: "string",
      userDescription:
        "Gmail-compatible search query (e.g. 'from:boss has:attachment')",
      aiDescription: "Search string used to filter Gmail messages.",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson, userEmail } = config;
    const { q } = args;

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
      subject: userEmail,
    });

    const gmail = google.gmail({ version: "v1", auth });

    try {
      const searchResponse = await gmail.users.messages.list({
        userId: "me",
        q,
        maxResults: 10,
      });

      const messageIds = searchResponse.data.messages ?? [];

      const messages = await Promise.all(
        messageIds.map(async ({ id }) => {
          if (!id) return null;
          const res = await gmail.users.messages.get({
            userId: "me",
            id,
            format: "metadata",
            metadataHeaders: ["From", "To", "Subject", "Date"],
          });

          const headers = res.data.payload?.headers || [];
          const getHeader = (name: string) =>
            headers.find((h) => h.name.toLowerCase() === name.toLowerCase())
              ?.value ?? "";

          return {
            id,
            snippet: res.data.snippet,
            from: getHeader("From"),
            to: getHeader("To"),
            subject: getHeader("Subject"),
            date: getHeader("Date"),
          };
        }),
      );

      return {
        results: {
          query: q,
          messages: messages.filter(Boolean),
        },
        log: {
          message: `Search returned ${messages.length} results.`,
          data: messages,
        },
      };
    } catch (err) {
      return {
        results: {},
        log: {
          message: "Failed to search Gmail messages.",
          data: err,
        },
      };
    }
  },
};
