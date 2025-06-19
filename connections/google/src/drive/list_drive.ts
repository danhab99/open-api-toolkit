import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const listGoogleDriveFiles: Tool = {
  name: "listGoogleDriveFiles",
  userDescription: "List files in Google Drive with pagination support.",
  aiDescription:
    "Retrieves a list of files, optionally specifying page size and page token.",
  arguments: [
    {
      name: "pageSize",
      type: "number",
      userDescription: "Number of files to return.",
      aiDescription: "Max results per page.",
    },
    {
      name: "pageToken",
      type: "string",
      userDescription: "Token for the next page of results.",
      aiDescription: "Pagination token.",
    },
    {
      name: "q",
      type: "string",
      userDescription: "Optional search query (Drive API query syntax).",
      aiDescription: "Query string to filter files.",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson, userEmail } = config;
    const { pageSize = 10, pageToken, q } = args;

    const credentials = JSON.parse(serviceAccountJson);
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
      subject: userEmail,
    });

    const drive = google.drive({ version: "v3", auth });

    try {
      const res = await drive.files.list({
        pageSize,
        pageToken,
        q,
        fields: "nextPageToken, files(id, name, mimeType, parents)",
      });

      return {
        results: {
          files: res.data.files || [],
          nextPageToken: res.data.nextPageToken,
        },
        log: {
          message: `Retrieved ${res.data.files?.length || 0} files.`,
          data: res.data,
        },
      };
    } catch (error) {
      return {
        results: {},
        log: { message: "Failed to list files.", data: error },
      };
    }
  },
};
