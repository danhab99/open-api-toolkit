import { Tool } from "open-api-connection-types";
import { getGmail } from "../lib";

export const getGmailThreadWithServiceAccount: Tool = {
  id: "getGmailThread",
  displayName: "Get Gmail Thread",
  userDescription:
    "Fetch all messages in an email thread using a service account and delegated access.",
  aiDescription:
    "Retrieves a Gmail thread including all messages using service account impersonation.",
  arguments: [
    {
      id: "threadId",
      displayName: "Thread ID",
      type: "string",
      userDescription: "The ID of the Gmail thread to retrieve.",
      aiDescription: "Gmail thread ID.",
    },
  ],
  async handler(config, args) {
    const { threadId } = args;
    const gmail = getGmail(config);

    try {
      const res = await gmail.users.threads.get({
        userId: "me",
        id: threadId,
        format: "full", // full includes headers, body, etc.
      });

      const messages = (res.data.messages || []).map((msg) => {
        const payload = msg.payload || {};
        const headers = payload.headers || [];

        const getHeader = (name: string) =>
          headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())
            ?.value ?? "";

        const parts = payload.parts || [];
        let bodyText = "";

        // Extract plain text or HTML part
        for (const part of parts) {
          if (part.mimeType === "text/plain" || part.mimeType === "text/html") {
            const data = part.body?.data;
            if (data) {
              bodyText = Buffer.from(data, "base64").toString("utf-8");
              break;
            }
          }
        }

        if (!bodyText && payload.body?.data) {
          bodyText = Buffer.from(payload.body.data, "base64").toString("utf-8");
        }

        return {
          id: msg.id,
          threadId: msg.threadId,
          snippet: msg.snippet,
          from: getHeader("From"),
          to: getHeader("To"),
          subject: getHeader("Subject"),
          date: getHeader("Date"),
          body: bodyText,
        };
      });

      return {
        results: {
          threadId,
          messages,
        },
        log: {
          message: `Fetched ${messages.length} messages from thread ${threadId}.`,
          data: messages,
        },
      };
    } catch (err) {
      return {
        results: {},
        log: {
          message: "Failed to fetch Gmail thread.",
          data: err,
        },
      };
    }
  },
};
