import { OpenAPIConnectionDefinition } from "open-api-connection-types";
import { createGoogleCalendarEventTool } from "./calendar";

export const Connection: OpenAPIConnectionDefinition = {
  id: "google_calendar",
  name: "Google Calendar",
  userDescription: "Connects to Google Calendar using a service account",
  aiDescription:
    "Allows tools to manage events in a Google Calendar via the API",
  configurationArguments: [
    {
      name: "serviceAccountJson",
      userDescription: "Service Account JSON",
      aiDescription: "The Google service account credentials as a JSON string",
      type: "string",
    },
  ],
} as OpenAPIConnectionDefinition;

export const Tools = [createGoogleCalendarEventTool];
