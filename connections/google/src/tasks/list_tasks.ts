import { Tool } from "open-api-connection-types";
import { getTaskList } from "../lib";

export const listGoogleTasks: Tool = {
  id: "listGoogleTasks",
  displayName: "List tasks",
  userDescription: "List tasks from a specified Google Tasks task list.",
  aiDescription:
    "Retrieves tasks from a given task list, with optional max results.",
  arguments: [
    {
      id: "tasklistId",
      displayName: "List tasks",
      type: "string",
      userDescription: "ID of the task list.",
      aiDescription: "Task list identifier.",
    },
    {
      id: "maxResults",
      displayName: "Max results",
      type: "number",
      userDescription: "Maximum number of tasks to return.",
      aiDescription: "Limits number of tasks.",
    },
  ],
  async handler(config, args) {
    let { maxResults = 10 } = args;
    const { tasks, tasklistId } = await getTaskList(config, args);

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
