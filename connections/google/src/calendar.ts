import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const createGoogleCalendarEventTool: Tool = {
  name: "Create Google Calendar Event",
  userDescription:
    "Creates an event in a Google Calendar using a service account",
  aiDescription:
    "Use this tool to create calendar events",
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
    const serviceAccountJson = config["serviceAccountJson"];
    if (!serviceAccountJson)
      throw new Error("Missing serviceAccountJson in config");

    const credentials =
      typeof serviceAccountJson === "string"
        ? JSON.parse(serviceAccountJson)
        : serviceAccountJson;

    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    const response = await calendar.events.insert({
      calendarId: args["calendarId"],
      requestBody: {
        summary: args["summary"],
        description: args["description"],
        start: { dateTime: args["start"] },
        end: { dateTime: args["end"] },
      },
    });

    return { eventId: response.data.id, status: response.status };
  },
} as Tool;
