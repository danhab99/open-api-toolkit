import { Tool } from "open-api-connection-types";
import { getCalendar } from "../lib";

export const viewGoogleCalendarEvents: Tool = {
  id: "viewGoogleCalendarEvents",
  displayName: "View calendar",
  userDescription:
    "View upcoming events from a Google Calendar using a service account.",
  aiDescription:
    "Retrieve calendar events using a configured Google service account with access to a specific calendar.",
  arguments: [
    {
      id: "calendarId",
      displayName: "Calendar ID",
      type: "string",
      userDescription:
        "The calendar ID to retrieve events from (e.g., primary, or calendar@example.com).",
      aiDescription: "Google Calendar ID to list events from.",
    },
    {
      id: "startDate",
      displayName: "Start Date",
      type: "string",
      userDescription: "Start date (ISO format, e.g. 2025-06-01T00:00:00Z).",
      aiDescription: "Earliest start time of events to fetch.",
    },
    {
      id: "endDate",
      displayName: "End Date",
      type: "string",
      userDescription: "End date (ISO format, e.g. 2025-06-30T00:00:00Z).",
      aiDescription: "Latest end time of events to fetch.",
    },
    {
      id: "maxResults",
      displayName: "Max Results",
      type: "number",
      userDescription: "Maximum number of events to return.",
      aiDescription: "Limit for the number of events returned.",
    },
  ],
  async handler(config, args) {
    const { calendarId, startDate, endDate, maxResults } = args;
    const calendar = getCalendar(config);

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
