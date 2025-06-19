import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const moveGoogleDriveFile: Tool = {
  name: "moveGoogleDriveFile",
  userDescription: "Move a file to another folder in Google Drive.",
  aiDescription:
    "Moves the file by adding a new parent folder and removing the old one.",
  arguments: [
    {
      name: "fileId",
      type: "string",
      userDescription: "ID of the file to move.",
      aiDescription: "File resource ID.",
    },
    {
      name: "targetFolderId",
      type: "string",
      userDescription: "ID of the destination folder.",
      aiDescription: "New parent folder ID.",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson, userEmail } = config;
    const { fileId, targetFolderId } = args;

    const credentials = JSON.parse(serviceAccountJson);
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/drive"],
      subject: userEmail,
    });

    const drive = google.drive({ version: "v3", auth });

    try {
      // First get current parents
      const getRes = await drive.files.get({
        fileId,
        fields: "parents",
      });

      const previousParents = getRes.data.parents?.join(",") || "";

      // Move file by adding new parent and removing old parents
      const updateRes = await drive.files.update({
        fileId,
        addParents: targetFolderId,
        removeParents: previousParents,
        fields: "id, parents",
      });

      return {
        results: { file: updateRes.data },
        log: { message: "File moved successfully.", data: updateRes.data },
      };
    } catch (error) {
      return {
        results: {},
        log: { message: "Failed to move file.", data: error },
      };
    }
  },
};
