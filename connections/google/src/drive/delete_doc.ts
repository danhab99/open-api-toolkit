import { Tool } from "open-api-connection-types";
import { getDrive } from "../lib";

export const deleteGoogleDriveFile: Tool = {
  id: "deleteGoogleDriveFile",
  displayName: "Delete file",
  userDescription: "Delete a file from Google Drive by ID.",
  aiDescription: "Deletes the file specified by file ID.",
  arguments: [
    {
      id: "fileId",
      displayName: "File ID",
      type: "string",
      userDescription: "ID of the file to delete.",
      aiDescription: "File resource ID.",
    },
  ],
  async handler(config, args) {
    const { fileId } = args;
    const drive = getDrive(config);

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
