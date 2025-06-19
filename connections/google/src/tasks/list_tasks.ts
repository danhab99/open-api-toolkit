import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const listGoogleTasks: Tool = {
  name: "listGoogleTasks",
  userDescription: "List tasks from a specified Google Tasks task list.",
  aiDescription:
    "Retrieves tasks from a given task list, with optional max results.",
  arguments: [
    {
      name: "tasklistId",
      type: "string",
      userDescription: "ID of the task list.",
      aiDescription: "Task list identifier.",
    },
    {
      name: "maxResults",
      type: "number",
      userDescription: "Maximum number of tasks to return.",
      aiDescription: "Limits number of tasks.",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson, userEmail } = config;
    const { tasklistId, maxResults = 10 } = args;

    const credentials = JSON.parse(serviceAccountJson);
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/tasks.readonly"],
      subject: userEmail,
    });

    const tasks = google.tasks({ version: "v1", auth });

    try {
      const res = await tasks.tasks.list({
        tasklist: tasklistId,
        maxResults,
      });

      return {
        results: { tasks: res.data.items || [] },
        log: {
          message: `Retrieved ${res.data.items?.length || 0} tasks.`,
          data: res.data,
        },
      };
    } catch (error) {
      return {
        results: {},
        log: { message: "Failed to list tasks.", data: error },
      };
    }
  },
};
