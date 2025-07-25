import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";
import { getGmail } from "../lib";

export const searchGmailMessagesWithServiceAccount: Tool = {
  id: "searchGmailMessagesWithServiceAccount",
  displayName: "Search Emails",
  userDescription:
    "Search Gmail for messages using a query string and return up to 10 results.",
  aiDescription:
    "Searches a user's Gmail inbox using a search query string. Returns up to 10 emails.",
  arguments: [
    {
      id: "q",
      displayName: "Query",
      type: "string",
      userDescription:
        "Gmail-compatible search query (e.g. 'from:boss has:attachment')",
      aiDescription: "Search string used to filter Gmail messages.",
    },
  ],
  async handler(config, args) {
    const { q } = args;
    const gmail = getGmail(config);

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
