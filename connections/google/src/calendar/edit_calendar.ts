import { Tool } from "open-api-connection-types";
import { getCalendar } from "../lib";

export const editGoogleCalendarEventWithServiceAccount: Tool = {
  id: "editGoogleCalendarEventWithServiceAccount",
  displayName: "Edit Event",
  userDescription:
    "Edit an existing event in a Google Calendar using a service account.",
  aiDescription:
    "Update an existing event's details (e.g., time or title) using a service account.",
  arguments: [
    {
      id: "calendarId",
      displayName: "Calendar ID",
      type: "string",
      userDescription:
        "The calendar ID containing the event (e.g., 'primary' or calendar@example.com).",
      aiDescription: "Google Calendar ID where the event is located.",
    },
    {
      id: "eventId",
      displayName: "Event ID",
      type: "string",
      userDescription: "The ID of the event to update.",
      aiDescription:
        "Unique identifier of the Google Calendar event to be edited.",
    },
    {
      id: "summary",
      displayName: "Summary",
      type: "string",
      userDescription: "Updated event title (optional).",
      aiDescription: "New title for the event (optional).",
    },
    {
      id: "description",
      displayName: "Description",
      type: "string",
      userDescription: "Updated event description (optional).",
      aiDescription: "New description for the event (optional).",
    },
    {
      id: "start",
      displayName: "Start",
      type: "string",
      userDescription: "Updated start datetime in ISO format (optional).",
      aiDescription: "New start time in ISO 8601 format (optional).",
    },
    {
      id: "end",
      displayName: "End",
      type: "string",
      userDescription: "Updated end datetime in ISO format (optional).",
      aiDescription: "New end time in ISO 8601 format (optional).",
    },
  ],
  async handler(config, args) {
    const { calendarId, eventId, summary, description, start, end } = args;
    const calendar = getCalendar(config);

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
