import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const viewGoogleCalendarEventsWithServiceAccount: Tool = {
  name: "viewGoogleCalendarEventsWithServiceAccount",
  userDescription:
    "View upcoming events from a Google Calendar using a service account.",
  aiDescription:
    "Retrieve calendar events using a configured Google service account with access to a specific calendar.",
  arguments: [
    {
      name: "calendarId",
      type: "string",
      userDescription:
        "The calendar ID to retrieve events from (e.g., primary, or calendar@example.com).",
      aiDescription: "Google Calendar ID to list events from.",
    },
    {
      name: "startDate",
      type: "string",
      userDescription: "Start date (ISO format, e.g. 2025-06-01T00:00:00Z).",
      aiDescription: "Earliest start time of events to fetch.",
    },
    {
      name: "endDate",
      type: "string",
      userDescription: "End date (ISO format, e.g. 2025-06-30T00:00:00Z).",
      aiDescription: "Latest end time of events to fetch.",
    },
    {
      name: "maxResults",
      type: "number",
      userDescription: "Maximum number of events to return.",
      aiDescription: "Limit for the number of events returned.",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson } = config;
    const { calendarId, startDate, endDate, maxResults } = args;

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
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    });

    const calendar = google.calendar({ version: "v3", auth: client });

    try {
      const res = await calendar.events.list({
        calendarId,
        timeMin: startDate,
        timeMax: endDate,
        maxResults: maxResults ?? 10,
        singleEvents: true,
        orderBy: "startTime",
      });

      return {
        results: {
          events: (res.data.items || []).map((e) => ({
            id: e.id,
            summary: e.summary,
            start: e.start?.dateTime ?? e.start?.date,
            end: e.end?.dateTime ?? e.end?.date,
            location: e.location,
            status: e.status,
          })),
        },
        log: {
          message: `Fetched ${res.data.items?.length || 0} events.`,
        },
      };
    } catch (error) {
      return {
        results: {},
        log: {
          message: "Failed to fetch calendar events",
          data: error,
        },
      };
    }
  },
};
