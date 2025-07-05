import { Tool } from "open-api-connection-types";
import { getTasks } from "../lib";

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
    const { tasklistId, taskId } = args;
    const tasks = getTasks(config);

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
