import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const updateGoogleTask: Tool = {
  name: "updateGoogleTask",
  userDescription:
    "Update a task's details in a specified Google Tasks task list.",
  aiDescription:
    "Updates the title, notes, and/or due date of an existing task.",
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
      userDescription: "ID of the task to update.",
      aiDescription: "Task identifier.",
    },
    {
      name: "title",
      type: "string",
      userDescription: "New task title.",
      aiDescription: "Updated title.",
    },
    {
      name: "notes",
      type: "string",
      userDescription: "New notes for the task.",
      aiDescription: "Updated notes.",
    },
    {
      name: "due",
      type: "string",
      userDescription: "New ISO due date.",
      aiDescription: "Updated due date/time.",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson, userEmail } = config;
    const { tasklistId, taskId, title, notes, due } = args;

    const credentials = JSON.parse(serviceAccountJson);
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/tasks"],
      subject: userEmail,
    });

    const tasks = google.tasks({ version: "v1", auth });

    try {
      const res = await tasks.tasks.update({
        tasklist: tasklistId,
        task: taskId,
        requestBody: {
          title,
          notes,
          due,
        },
      });

      return {
        results: { task: res.data },
        log: { message: "Task updated.", data: res.data },
      };
    } catch (error) {
      return {
        results: {},
        log: { message: "Failed to update task.", data: error },
      };
    }
  },
};
