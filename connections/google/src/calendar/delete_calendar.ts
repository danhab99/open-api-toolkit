import { Tool } from "open-api-connection-types";
import { getThisCalendar } from "../lib";

export const deleteGoogleCalendarEvent: Tool = {
  id: "deleteGoogleCalendarEventWith",
  displayName: "Delete Calendar Event",
  userDescription:
    "Delete an event from a Google Calendar using a service account.",
  aiDescription:
    "Remove a specific event from a Google Calendar using service account credentials.",
  arguments: [
    {
      id: "calendarId",
      displayName: "Calendar ID",
      type: "string",
      userDescription:
        "The calendar ID where the event exists (e.g., 'primary' or calendar@example.com).",
      aiDescription:
        "Calendar identifier from which the event should be deleted.",
    },
    {
      id: "eventId",
      displayName: "Event ID",
      type: "string",
      userDescription: "The ID of the event to delete.",
      aiDescription: "Unique identifier of the calendar event to be deleted.",
    },
  ],
  async handler(config, args) {
    const { eventId } = args;
    const { calendar, calendarId } = await getThisCalendar(config, args);

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
