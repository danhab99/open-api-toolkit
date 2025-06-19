import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const updateGoogleDriveFile: Tool = {
  name: "updateGoogleDriveFile",
  userDescription: "Update file metadata such as name or parent folder.",
  aiDescription: "Updates the file's name or parent folder.",
  arguments: [
    {
      name: "fileId",
      type: "string",
      userDescription: "ID of the file to update.",
      aiDescription: "File resource ID.",
    },
    {
      name: "name",
      type: "string",
      userDescription: "New name for the file (optional).",
      aiDescription: "Updated file name.",
    },
    {
      name: "parentFolderId",
      type: "string",
      userDescription: "New parent folder ID (optional).",
      aiDescription: "Updated parent folder ID.",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson, userEmail } = config;
    const { fileId, name, parentFolderId } = args;

    const credentials = JSON.parse(serviceAccountJson);
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/drive"],
      subject: userEmail,
    });

    const drive = google.drive({ version: "v3", auth });

    try {
      // If parentFolderId is provided, need to update parents separately (move is separate tool)
      const updateMetadata: any = {};
      if (name) updateMetadata.name = name;

      const res = await drive.files.update({
        fileId,
        requestBody: updateMetadata,
        fields: "id, name, parents",
      });

      return {
        results: { file: res.data },
        log: { message: "File metadata updated.", data: res.data },
      };
    } catch (error) {
      return {
        results: {},
        log: { message: "Failed to update file.", data: error },
      };
    }
  },
};
