import { Tool } from "open-api-connection-types";
import { getCalendar } from "./lib";

export const createGoogleCalendarEventTool: Tool = {
  name: "Create Google Calendar Event",
  userDescription:
    "Creates an event in a Google Calendar using a service account",
  aiDescription: "Use this tool to create calendar events",
  arguments: [
    {
      name: "calendarId",
      userDescription: "Calendar ID",
      aiDescription: "ID of the calendar",
      type: "string",
    },
    {
      name: "summary",
      userDescription: "Event Summary",
      aiDescription: "Title of the event",
      type: "string",
    },
    {
      name: "description",
      userDescription: "Event Description",
      aiDescription: "Details of the event",
      type: "string",
    },
    {
      name: "start",
      userDescription: "Start Time",
      aiDescription: "RFC3339 start time",
      type: "string",
    },
    {
      name: "end",
      userDescription: "End Time",
      aiDescription: "RFC3339 end time",
      type: "string",
    },
  ],
  handler: async (config, args) => {
    const calendar = getCalendar(config);

    const response = await calendar.events.insert({
      calendarId: args["calendarId"],
      requestBody: {
        summary: args["summary"],
        description: args["description"],
        start: { dateTime: args["start"] },
        end: { dateTime: args["end"] },
      },
    });

    return {
      results: { eventId: response.data.id, status: response.status },
    };
  },
} as Tool;
