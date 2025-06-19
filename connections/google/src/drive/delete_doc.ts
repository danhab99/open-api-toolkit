import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const deleteGoogleDriveFile: Tool = {
  name: "deleteGoogleDriveFile",
  userDescription: "Delete a file from Google Drive by ID.",
  aiDescription: "Deletes the file specified by file ID.",
  arguments: [
    {
      name: "fileId",
      type: "string",
      userDescription: "ID of the file to delete.",
      aiDescription: "File resource ID.",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson, userEmail } = config;
    const { fileId } = args;

    const credentials = JSON.parse(serviceAccountJson);
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/drive"],
      subject: userEmail,
    });

    const drive = google.drive({ version: "v3", auth });

    try {
      await drive.files.delete({ fileId });

      return {
        results: { fileId },
        log: { message: "File deleted." },
      };
    } catch (error) {
      return {
        results: {},
        log: { message: "Failed to delete file.", data: error },
      };
    }
  },
};
