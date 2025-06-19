import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const editGoogleCalendarEventWithServiceAccount: Tool = {
  name: "editGoogleCalendarEventWithServiceAccount",
  userDescription:
    "Edit an existing event in a Google Calendar using a service account.",
  aiDescription:
    "Update an existing event's details (e.g., time or title) using a service account.",
  arguments: [
    {
      name: "calendarId",
      type: "string",
      userDescription:
        "The calendar ID containing the event (e.g., 'primary' or calendar@example.com).",
      aiDescription: "Google Calendar ID where the event is located.",
    },
    {
      name: "eventId",
      type: "string",
      userDescription: "The ID of the event to update.",
      aiDescription:
        "Unique identifier of the Google Calendar event to be edited.",
    },
    {
      name: "summary",
      type: "string",
      userDescription: "Updated event title (optional).",
      aiDescription: "New title for the event (optional).",
    },
    {
      name: "description",
      type: "string",
      userDescription: "Updated event description (optional).",
      aiDescription: "New description for the event (optional).",
    },
    {
      name: "start",
      type: "string",
      userDescription: "Updated start datetime in ISO format (optional).",
      aiDescription: "New start time in ISO 8601 format (optional).",
    },
    {
      name: "end",
      type: "string",
      userDescription: "Updated end datetime in ISO format (optional).",
      aiDescription: "New end time in ISO 8601 format (optional).",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson } = config;
    const { calendarId, eventId, summary, description, start, end } = args;

    let credentials;
    try {
      credentials = JSON.parse(serviceAccountJson);
    } catch (e) {
      return {
        results: {},
        log: {
          message: "Invalid service account JSON",
          data: e,
        },
      };
    }

    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth: client });

    try {
      const existing = await calendar.events.get({
        calendarId,
        eventId,
      });

      const updatedEvent = {
        ...existing.data,
        summary: summary ?? existing.data.summary,
        description: description ?? existing.data.description,
        start: start ? { dateTime: start } : existing.data.start,
        end: end ? { dateTime: end } : existing.data.end,
      };

      const res = await calendar.events.update({
        calendarId,
        eventId,
        requestBody: updatedEvent,
      });

      return {
        results: {
          updatedEvent: {
            id: res.data.id,
            summary: res.data.summary,
            start: res.data.start,
            end: res.data.end,
          },
        },
        log: {
          message: `Event ${eventId} updated successfully.`,
          data: res.data,
        },
      };
    } catch (error) {
      return {
        results: {},
        log: {
          message: "Failed to edit calendar event",
          data: error,
        },
      };
    }
  },
};
