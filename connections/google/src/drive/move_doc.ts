import { Tool } from "open-api-connection-types";
import { getDrive } from "../lib";

export const moveGoogleDriveFile: Tool = {
  id: "moveGoogleDriveFile",
  displayName: "Move file",
  userDescription: "Move a file to another folder in Google Drive.",
  aiDescription:
    "Moves the file by adding a new parent folder and removing the old one.",
  arguments: [
    {
      id: "fileId",
      displayName: "File ID",
      type: "string",
      userDescription: "ID of the file to move.",
      aiDescription: "File resource ID.",
    },
    {
      id: "targetFolderId",
      displayName: "Target Folder ID",
      type: "string",
      userDescription: "ID of the destination folder.",
      aiDescription: "New parent folder ID.",
    },
  ],
  async handler(config, args) {
    const { fileId, targetFolderId } = args;
    const drive = getDrive(config);

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
