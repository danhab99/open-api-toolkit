import { Tool } from "open-api-connection-types";
import { getThisCalendar } from "../lib";
import { calendar_v3 } from "googleapis";

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
    console.log({ config, args });
    const { startDate, endDate, maxResults } = args;
    const { calendar, calendarId } = await getThisCalendar(config, args);

    try {
      let events: calendar_v3.Schema$Event[] = [];

      if ((calendarId as string).length > 0) {
        const res = await calendar.events.list({
          calendarId: args.id,
          timeMin: startDate,
          timeMax: endDate,
          maxResults: maxResults ?? 10,
          singleEvents: true,
          orderBy: "startTime",
        });

        events = res.data.items ?? [];
      } else {
        const list = await calendar.calendarList.list();
        console.log("Listing all calendars", list.data.items);

        if (list.data.items) {
          const eventLists = await Promise.all(
            list.data.items
              .filter((x) => x.id)
              .map((item) =>
                calendar.events.list({
                  calendarId: item.id!,
                  timeMin: startDate,
                  timeMax: endDate,
                  maxResults: maxResults ?? 10,
                  singleEvents: true,
                  orderBy: "startTime",
                }),
              ),
          );

          events = eventLists
            .map((x) => x.data.items)
            .filter((x) => Array.isArray(x))
            .flat();
        }
      }

      return {
        results: {
          events: events.map((e) => ({
            id: e.id,
            summary: e.summary,
            start: e.start?.dateTime ?? e.start?.date,
            end: e.end?.dateTime ?? e.end?.date,
            location: e.location,
            status: e.status,
          })),
        },
        log: {
          message: `Fetched ${events.length} events.`,
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
