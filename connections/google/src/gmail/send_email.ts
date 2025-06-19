import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { encode as base64url } from "base64url";
import { Tool } from "open-api-connection-types";

export const sendGmailMessageWithServiceAccount: Tool = {
  name: "sendGmailMessageWithServiceAccount",
  userDescription:
    "Send an email using the Gmail API and a service account with delegated access.",
  aiDescription:
    "Sends an email from a user's Gmail account using service account impersonation.",
  arguments: [
    {
      name: "to",
      type: "string",
      userDescription: "The recipient's email address.",
      aiDescription: "Recipient's email address.",
    },
    {
      name: "subject",
      type: "string",
      userDescription: "Subject line of the email.",
      aiDescription: "Email subject.",
    },
    {
      name: "body",
      type: "string",
      userDescription: "Body of the email in plain text or HTML.",
      aiDescription: "Email content (text or HTML).",
    },
    {
      name: "isHtml",
      type: "string",
      userDescription:
        "Set to 'true' to send HTML content. Defaults to plain text.",
      aiDescription:
        "Whether to send the message as HTML. Accepts 'true' or 'false'.",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson, userEmail } = config;
    const { to, subject, body, isHtml } = args;

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
      scopes: ["https://www.googleapis.com/auth/gmail.send"],
      subject: userEmail,
    });

    const gmail = google.gmail({ version: "v1", auth });

    const contentType = isHtml === "true" ? "text/html" : "text/plain";

    const rawMessage = [
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      `Content-Type: ${contentType}; charset=utf-8`,
      "",
      body,
    ].join("\n");

    const encodedMessage = Buffer.from(rawMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    try {
      const res = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedMessage,
        },
      });

      return {
        results: {
          messageId: res.data.id,
          threadId: res.data.threadId,
        },
        log: {
          message: `Email sent successfully to ${to}.`,
          data: res.data,
        },
      };
    } catch (error) {
      return {
        results: {},
        log: {
          message: "Failed to send email.",
          data: error,
        },
      };
    }
  },
};
