import { Tool } from "open-api-connection-types";
import { getThisCalendar } from "../lib";

export const createGoogleCalendarEvents: Tool = {
  id: "createGoogleCalendarEvent",
  displayName: "Create calendar event",
  userDescription: "create event on a Google Calendar using a service account.",
  aiDescription:
    "Create calendar event using a configured Google service account on a specific calendar.",
  arguments: [
    {
      id: "calendarId",
      displayName: "Calendar ID",
      type: "string",
      userDescription:
        "The calendar ID to retrieve events from (e.g., 'primary' for your primary calendar or an email address like 'calendar@example.com'). This specifies which calendar the tool will interact with.",
      aiDescription:
        "Identifies the Google Calendar by its unique ID, determining where events are created or listed.",
    },
    {
      id: "startDate",
      displayName: "Start Date",
      type: "string",
      userDescription:
        "Start date in ISO format (e.g., '2025-06-01T00:00:00Z'). This marks the beginning of the time range for filtering calendar events.",
      aiDescription:
        "Specifies the earliest start datetime to filter and retrieve events from the Google Calendar.",
    },
    {
      id: "endDate",
      displayName: "End Date",
      type: "string",
      userDescription:
        "End date in ISO format (e.g., '2025-06-30T00:00:00Z'). This marks the end of the time range for filtering calendar events.",
      aiDescription:
        "Defines the latest end datetime to filter and retrieve events from the Google Calendar.",
    },
    {
      id: "description",
      displayName: "Description",
      type: "string",
      userDescription:
        "A brief description of the event. This can include details such as the purpose or agenda, helping attendees understand the event context.",
      aiDescription:
        "Provides a detailed text summary for the event to be added to Google Calendar.",
    },
    {
      id: "summary",
      displayName: "Summary",
      type: "string",
      userDescription:
        "A concise title for the event. This is displayed in calendars and serves as an overview of what the event is about.",
      aiDescription:
        "Sets the brief title or summary for a new calendar event, appearing prominently in schedules.",
    },
    {
      id: "recurring",
      displayName: "Recurring",
      type: "boolean",
      userDescription:
        "Indicates whether this event recurs. Set to true if the event repeats at regular intervals, such as daily or weekly.",
      aiDescription:
        "Determines if the created event should be recurring, repeating based on specified rules.",
    },
    {
      id: "location",
      displayName: "Location",
      type: "string",
      userDescription:
        "The physical location where the event will occur. This can be an address or a general place description.",
      aiDescription:
        "Specifies the venue for the calendar event, aiding attendees in locating the event.",
    },
  ],
  async handler(config, args) {
    const { calendar, calendarId } = await getThisCalendar(config, args);

    try {
      const res = await calendar.events.insert({
        calendarId: calendarId,
        requestBody: {
          description: args.description,
          end: args.endDate,
          eventType: "default",
          start: args.startDate,
          location: args.location,
          recurrence: args.recurring,
          visibility: "private",
          endTimeUnspecified: !!args.endDate,
          summary: args.summary,
        },
      });

      const ok = res.status >= 200 && res.status < 300;

      return {
        results: {
          ok,
        },
        log: {
          ok,
          res,
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
