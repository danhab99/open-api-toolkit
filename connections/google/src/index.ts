import { OpenAPIConnectionDefinition } from "open-api-connection-types";
import { createGoogleCalendarEventsWithServiceAccount } from "./calendar/create_calendar";
import { deleteGoogleCalendarEventWithServiceAccount } from "./calendar/delete_calendar";
import { editGoogleCalendarEventWithServiceAccount } from "./calendar/edit_calendar";
import { createGoogleContact } from "./contacts/create_contact";
import { deleteGoogleContact } from "./contacts/delete_contact";
import { updateGoogleContact } from "./contacts/update_contact";
import { createGoogleDriveFile } from "./drive/create_doc";
import { deleteGoogleDriveFile } from "./drive/delete_doc";
import { listGoogleDriveFiles } from "./drive/list_drive";
import { moveGoogleDriveFile } from "./drive/move_doc";
import { updateGoogleDriveFile } from "./drive/update_doc";
import { getGmailThreadWithServiceAccount } from "./gmail/get_emails";
import { listGmailMessagesWithServiceAccount } from "./gmail/list_gmail";
import { searchGmailMessagesWithServiceAccount } from "./gmail/search_emails";
import { sendGmailMessageWithServiceAccount } from "./gmail/send_email";
import { createGoogleTask } from "./tasks/create_task";
import { deleteGoogleTask } from "./tasks/delete_task";
import { listGoogleTasks } from "./tasks/list_tasks";
import { updateGoogleTask } from "./tasks/update_task";

export const Connection: OpenAPIConnectionDefinition = {
  id: "google_calendar",
  name: "Google Calendar",
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
  deleteGoogleCalendarEventWithServiceAccount,
  editGoogleCalendarEventWithServiceAccount,
  createGoogleContact,
  deleteGoogleContact,
  updateGoogleContact,
  createGoogleDriveFile,
  deleteGoogleDriveFile,
  listGoogleDriveFiles,
  moveGoogleDriveFile,
  updateGoogleDriveFile,
  getGmailThreadWithServiceAccount,
  listGmailMessagesWithServiceAccount,
  searchGmailMessagesWithServiceAccount,
  sendGmailMessageWithServiceAccount,
  createGoogleTask,
  deleteGoogleTask,
  listGoogleTasks,
  updateGoogleTask,
];
