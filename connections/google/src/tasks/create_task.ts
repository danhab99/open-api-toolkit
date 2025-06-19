import { Tool } from "open-api-connection-types";
import { google } from "googleapis";
import { JWT } from "google-auth-library";

export const createGoogleTask: Tool = {
  name: "createGoogleTask",
  userDescription: "Create a new task in a specified Google Tasks task list.",
  aiDescription:
    "Creates a task with title, notes, and optional due date in a given task list.",
  arguments: [
    {
      name: "tasklistId",
      type: "string",
      userDescription: "ID of the task list.",
      aiDescription: "Task list identifier.",
    },
    {
      name: "title",
      type: "string",
      userDescription: "Task title.",
      aiDescription: "Title of the new task.",
    },
    {
      name: "notes",
      type: "string",
      userDescription: "Notes/details about the task.",
      aiDescription: "Optional detailed description.",
    },
    {
      name: "due",
      type: "string",
      userDescription: "ISO due date (e.g. 2025-06-20T12:00:00Z).",
      aiDescription: "Optional due date/time in ISO format.",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson, userEmail } = config;
    const { tasklistId, title, notes, due } = args;

    const credentials = JSON.parse(serviceAccountJson);
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/tasks"],
      subject: userEmail,
    });

    const tasks = google.tasks({ version: "v1", auth });

    try {
      const res = await tasks.tasks.insert({
        tasklist: tasklistId,
        requestBody: {
          title,
          notes,
          due,
        },
      });

      return {
        results: { task: res.data },
        log: { message: "Task created.", data: res.data },
      };
    } catch (error) {
      return {
        results: {},
        log: { message: "Failed to create task.", data: error },
      };
    }
  },
};
