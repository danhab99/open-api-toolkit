import { Tool } from "open-api-connection-types";
import { getTaskList } from "../lib";

export const createGoogleTask: Tool = {
  id: "createGoogleTask",
  displayName: "Create Task",
  userDescription: "Create a new task in a specified Google Tasks task list.",
  aiDescription:
    "Creates a task with title, notes, and optional due date in a given task list.",
  arguments: [
    {
      id: "tasklistId",
      displayName: "Task List ID",
      type: "string",
      userDescription: "ID of the task list.",
      aiDescription: "Task list identifier.",
    },
    {
      id: "title",
      displayName: "Title",
      type: "string",
      userDescription: "Task title.",
      aiDescription: "Title of the new task.",
    },
    {
      id: "notes",
      displayName: "Notes",
      type: "string",
      userDescription: "Notes/details about the task.",
      aiDescription: "Optional detailed description.",
    },
    {
      id: "due",
      displayName: "Due Date",
      type: "string",
      userDescription: "ISO due date (e.g. 2025-06-20T12:00:00Z).",
      aiDescription: "Optional due date/time in ISO format (e.g. 2025-06-20T12:00:00Z).",
    },
  ],
  async handler(config, args) {
    const { title, notes, due } = args;
    const { tasks, tasklistId } = await getTaskList(config, args);

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
