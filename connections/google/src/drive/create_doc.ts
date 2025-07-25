import { Tool } from "open-api-connection-types";
import { getDrive } from "../lib";

export const createGoogleDriveFile: Tool = {
  id: "createGoogleDriveFile",
  displayName: "Create file",
  userDescription: "Create a new file in Google Drive.",
  aiDescription:
    "Creates a file with a given name, mimeType, and optional parent folder.",
  arguments: [
    {
      id: "name",
      displayName: "Name",
      type: "string",
      userDescription: "Name of the new file.",
      aiDescription: "File name.",
    },
    {
      id: "mimeType",
      displayName: "Mime Type",
      type: "string",
      userDescription:
        "MIME type of the file (e.g., application/vnd.google-apps.document).",
      aiDescription: "File MIME type.",
    },
    {
      id: "parentFolderId",
      displayName: "Parent Folder ID",
      type: "string",
      userDescription: "ID of the parent folder (optional).",
      aiDescription: "Parent folder resource ID.",
    },
  ],
  async handler(config, args) {
    const { name, mimeType, parentFolderId } = args;
    const drive = getDrive(config);

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
