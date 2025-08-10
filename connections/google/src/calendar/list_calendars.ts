import { Tool } from "open-api-connection-types";
import { getCalendar } from "../lib";

export const listGoogleCalendarsWithServiceAccount: Tool = {
  id: "listGoogleCalendars",
  displayName: "List calendar events",
  userDescription:
    "View upcoming events from a Google Calendar using a service account.",
  aiDescription:
    "Retrieve calendar events using a configured Google service account with access to a specific calendar.",
  arguments: [],
  async handler(config, args) {
    const calendar = getCalendar(config);

    try {
      const res = await calendar.calendarList.list();

      return {
        results: {
          calendars:
            res.data.items?.map((cal) => ({
              calendarId: cal.id,
              color: cal.colorId,
              primary: cal.primary,
              description: cal.description,
              summary: cal.summary,
              timeZone: cal.timeZone,
            })) ?? [],
        },
        log: {
          message: `Fetched ${res.data.items?.length || 0} calendars.`,
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
