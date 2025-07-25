import { Tool } from "open-api-connection-types";
import { getDrive } from "../lib";

export const listGoogleDriveFiles: Tool = {
  id: "listGoogleDriveFiles",
  displayName: "List files",
  userDescription: "List files in Google Drive with pagination support.",
  aiDescription:
    "Retrieves a list of files, optionally specifying page size and page token.",
  arguments: [
    {
      id: "pageSize",
      displayName: "Page Size",
      type: "number",
      userDescription: "Number of files to return.",
      aiDescription: "Max results per page.",
    },
    {
      id: "pageToken",
      displayName: "Page Token",
      type: "string",
      userDescription: "Token for the next page of results.",
      aiDescription: "Pagination token.",
    },
    {
      id: "q",
      displayName: "Query",
      type: "string",
      userDescription: "Optional search query (Drive API query syntax).",
      aiDescription: "Query string to filter files.",
    },
  ],
  async handler(config, args) {
    const { pageSize = 10, pageToken, q } = args;
    const drive = getDrive(config);

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
