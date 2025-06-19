import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const deleteGoogleCalendarEventWithServiceAccount: Tool = {
  name: "deleteGoogleCalendarEventWithServiceAccount",
  userDescription:
    "Delete an event from a Google Calendar using a service account.",
  aiDescription:
    "Remove a specific event from a Google Calendar using service account credentials.",
  arguments: [
    {
      name: "calendarId",
      type: "string",
      userDescription:
        "The calendar ID where the event exists (e.g., 'primary' or calendar@example.com).",
      aiDescription:
        "Calendar identifier from which the event should be deleted.",
    },
    {
      name: "eventId",
      type: "string",
      userDescription: "The ID of the event to delete.",
      aiDescription: "Unique identifier of the calendar event to be deleted.",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson } = config;
    const { calendarId, eventId } = args;

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
      await calendar.events.delete({
        calendarId,
        eventId,
      });

      return {
        results: {
          deleted: true,
          eventId,
        },
        log: {
          message: `Event ${eventId} deleted from calendar ${calendarId}.`,
        },
      };
    } catch (error) {
      return {
        results: {
          deleted: false,
          eventId,
        },
        log: {
          message: `Failed to delete event ${eventId}`,
          data: error,
        },
      };
    }
  },
};
