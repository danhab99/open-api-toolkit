import { Tool } from "open-api-connection-types";
import { getTaskList } from "../lib";

export const updateGoogleTask: Tool = {
  id: "updateGoogleTask",
  displayName: "Update task",
  userDescription:
    "Update a task's details in a specified Google Tasks task list.",
  aiDescription:
    "Updates the title, notes, and/or due date of an existing task.",
  arguments: [
    {
      id: "tasklistId",
      displayName: "Task List ID",
      type: "string",
      userDescription: "ID of the task list.",
      aiDescription: "Task list identifier.",
    },
    {
      id: "taskId",
      displayName: "Task ID",
      type: "string",
      userDescription: "ID of the task to update.",
      aiDescription: "Task identifier.",
    },
    {
      id: "title",
      displayName: "Title",
      type: "string",
      userDescription: "New task title.",
      aiDescription: "Updated title.",
    },
    {
      id: "notes",
      displayName: "Notes",
      type: "string",
      userDescription: "New notes for the task.",
      aiDescription: "Updated notes.",
    },
    {
      id: "due",
      displayName: "Due Date",
      type: "string",
      userDescription: "New ISO due date.",
      aiDescription: "Updated due date/time.",
    },
  ],
  async handler(config, args) {
    const { taskId, title, notes, due } = args;
    const { tasks, tasklistId } = await getTaskList(config, args);

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
