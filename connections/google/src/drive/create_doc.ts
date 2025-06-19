import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const createGoogleDriveFile: Tool = {
  name: "createGoogleDriveFile",
  userDescription: "Create a new file in Google Drive.",
  aiDescription:
    "Creates a file with a given name, mimeType, and optional parent folder.",
  arguments: [
    {
      name: "name",
      type: "string",
      userDescription: "Name of the new file.",
      aiDescription: "File name.",
    },
    {
      name: "mimeType",
      type: "string",
      userDescription:
        "MIME type of the file (e.g., application/vnd.google-apps.document).",
      aiDescription: "File MIME type.",
    },
    {
      name: "parentFolderId",
      type: "string",
      userDescription: "ID of the parent folder (optional).",
      aiDescription: "Parent folder resource ID.",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson, userEmail } = config;
    const { name, mimeType, parentFolderId } = args;

    const credentials = JSON.parse(serviceAccountJson);
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/drive"],
      subject: userEmail,
    });

    const drive = google.drive({ version: "v3", auth });

    try {
      const fileMetadata: any = { name };
      if (parentFolderId) {
        fileMetadata.parents = [parentFolderId];
      }
      if (mimeType) {
        fileMetadata.mimeType = mimeType;
      }

      const res = await drive.files.create({
        requestBody: fileMetadata,
        fields: "id, name, mimeType, parents",
      });

      return {
        results: { file: res.data },
        log: { message: "File created.", data: res.data },
      };
    } catch (error) {
      return {
        results: {},
        log: { message: "Failed to create file.", data: error },
      };
    }
  },
};
