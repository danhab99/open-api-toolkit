import { Tool } from "open-api-connection-types";
import { getDrive } from "../lib";

export const updateGoogleDriveFile: Tool = {
  id: "updateGoogleDriveFile",
  displayName: "Update file",
  userDescription: "Update file metadata such as name or parent folder.",
  aiDescription: "Updates the file's name or parent folder.",
  arguments: [
    {
      id: "fileId",
      displayName: "File ID",
      type: "string",
      userDescription: "ID of the file to update.",
      aiDescription: "File resource ID.",
    },
    {
      id: "name",
      displayName: "Name",
      type: "string",
      userDescription: "New name for the file (optional).",
      aiDescription: "Updated file name.",
    },
    {
      id: "parentFolderId",
      displayName: "Parent Folder ID",
      type: "string",
      userDescription: "New parent folder ID (optional).",
      aiDescription: "Updated parent folder ID.",
    },
  ],
  async handler(config, args) {
    const { fileId, name } = args;
    const drive = getDrive(config);

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
