import { OpenAPIConnectionDefinition } from "open-api-connection-types";
import { createGoogleCalendarEventsWithServiceAccount } from "./calendar/create_calendar";
import { createGoogleContact } from "./contacts/create_contact";
import { createGoogleDriveFile } from "./drive/create_doc";
import { createGoogleTask } from "./tasks/create_task";
import { deleteGoogleCalendarEventWithServiceAccount } from "./calendar/delete_calendar";
import { deleteGoogleContact } from "./contacts/delete_contact";
import { deleteGoogleDriveFile } from "./drive/delete_doc";
import { deleteGoogleTask } from "./tasks/delete_task";
import { editGoogleCalendarEventWithServiceAccount } from "./calendar/edit_calendar";
import { getGmailThreadWithServiceAccount } from "./gmail/get_emails";
import { listGmailMessagesWithServiceAccount } from "./gmail/list_gmail";
import { listGoogleCalendarsWithServiceAccount } from "./calendar/list_calendars";
import { listGoogleDriveFiles } from "./drive/list_drive";
import { listGoogleTasks } from "./tasks/list_tasks";
import { moveGoogleDriveFile } from "./drive/move_doc";
import { searchGmailMessagesWithServiceAccount } from "./gmail/search_emails";
import { sendGmailMessageWithServiceAccount } from "./gmail/send_email";
import { updateGoogleContact } from "./contacts/update_contact";
import { updateGoogleDriveFile } from "./drive/update_doc";
import { updateGoogleTask } from "./tasks/update_task";
import { viewGoogleCalendarEventsWithServiceAccount } from "./calendar/view_calendar";

export const Connection: OpenAPIConnectionDefinition = {
  id: "google",
  name: "Google",
  userDescription: "Connects to Google using a service account",
  aiDescription: "Allows tools to manage google products for the user",
  configurationArguments: [
    {
      name: "serviceAccountJson",
      userDescription: "Service Account JSON",
      aiDescription: "The Google service account credentials as a JSON string",
      type: "string",
    },
    {
      name: "userEmail",
      type: "string",
      userDescription: "The email address of the user to impersonate.",
      aiDescription:
        "Email address of the user whose Gmail account will be accessed.",
    },
  ],
} as OpenAPIConnectionDefinition;

export const Tools = [
  createGoogleCalendarEventsWithServiceAccount,
  createGoogleContact,
  createGoogleDriveFile,
  createGoogleTask,
  deleteGoogleCalendarEventWithServiceAccount,
  deleteGoogleContact,
  deleteGoogleDriveFile,
  deleteGoogleTask,
  editGoogleCalendarEventWithServiceAccount,
  getGmailThreadWithServiceAccount,
  listGmailMessagesWithServiceAccount,
  listGoogleCalendarsWithServiceAccount,
  listGoogleDriveFiles,
  listGoogleTasks,
  moveGoogleDriveFile,
  searchGmailMessagesWithServiceAccount,
  sendGmailMessageWithServiceAccount,
  updateGoogleContact,
  updateGoogleDriveFile,
  updateGoogleTask,
  viewGoogleCalendarEventsWithServiceAccount,
];
