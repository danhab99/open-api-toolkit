import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const deleteGoogleTask: Tool = {
  name: "deleteGoogleTask",
  userDescription: "Delete a task from a Google Tasks task list.",
  aiDescription: "Deletes the specified task from the given task list.",
  arguments: [
    {
      name: "tasklistId",
      type: "string",
      userDescription: "ID of the task list.",
      aiDescription: "Task list identifier.",
    },
    {
      name: "taskId",
      type: "string",
      userDescription: "ID of the task to delete.",
      aiDescription: "Task identifier.",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson, userEmail } = config;
    const { tasklistId, taskId } = args;

    const credentials = JSON.parse(serviceAccountJson);
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/tasks"],
      subject: userEmail,
    });

    const tasks = google.tasks({ version: "v1", auth });

    try {
      await tasks.tasks.delete({
        tasklist: tasklistId,
        task: taskId,
      });

      return {
        results: { taskId },
        log: { message: "Task deleted." },
      };
    } catch (error) {
      return {
        results: {},
        log: { message: "Failed to delete task.", data: error },
      };
    }
  },
};
