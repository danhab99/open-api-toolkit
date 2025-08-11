import { OpenAPIConnectionDefinition } from "open-api-connection-types";
import { createGoogleCalendarEvents } from "./calendar/create_calendar";
import { createGoogleContact } from "./contacts/create_contact";
import { createGoogleDriveFile } from "./drive/create_doc";
import { createGoogleTask } from "./tasks/create_task";
import { deleteGoogleCalendarEvent } from "./calendar/delete_calendar";
import { deleteGoogleContact } from "./contacts/delete_contact";
import { deleteGoogleDriveFile } from "./drive/delete_doc";
import { deleteGoogleTask } from "./tasks/delete_task";
import { editGoogleCalendarEvent } from "./calendar/edit_calendar";
import { getGmailThread } from "./gmail/get_emails";
import { listGmailMessages } from "./gmail/list_gmail";
import { listGoogleCalendars } from "./calendar/list_calendars";
import { listGoogleDriveFiles } from "./drive/list_drive";
import { listGoogleTasks } from "./tasks/list_tasks";
import { moveGoogleDriveFile } from "./drive/move_doc";
import { searchGmailMessages } from "./gmail/search_emails";
import { sendGmailMessage } from "./gmail/send_email";
import { updateGoogleContact } from "./contacts/update_contact";
import { updateGoogleDriveFile } from "./drive/update_doc";
import { updateGoogleTask } from "./tasks/update_task";
import { viewGoogleCalendarEvents } from "./calendar/view_calendar";

export const Connection: OpenAPIConnectionDefinition = {
  id: "google",
  displayName: "Google",
  userDescription: "Connects to Google using a service account",
  aiDescription: "Allows tools to manage google products for the user",
  configurationArguments: [
    {
      id: "serviceAccountJson",
      displayName: "Service Account",
      userDescription: "Service Account JSON",
      aiDescription: "The Google service account credentials as a JSON string",
      type: "string",
    },
    {
      id: "userEmail",
      displayName: "User Email",
      type: "string",
      userDescription: "The email address of the user to impersonate.",
      aiDescription:
        "Email address of the user whose Gmail account will be accessed.",
    },
  ],
} as OpenAPIConnectionDefinition;

export const Tools = [
  createGoogleCalendarEvents,
  createGoogleContact,
  createGoogleDriveFile,
  createGoogleTask,
  deleteGoogleCalendarEvent,
  deleteGoogleContact,
  deleteGoogleDriveFile,
  deleteGoogleTask,
  editGoogleCalendarEvent,
  getGmailThread,
  listGmailMessages,
  listGoogleCalendars,
  listGoogleDriveFiles,
  listGoogleTasks,
  moveGoogleDriveFile,
  searchGmailMessages,
  sendGmailMessage,
  updateGoogleContact,
  updateGoogleDriveFile,
  updateGoogleTask,
  viewGoogleCalendarEvents,
];
