import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const deleteGoogleContact: Tool = {
  name: "deleteGoogleContact",
  userDescription: "Delete a contact by resource name.",
  aiDescription: "Deletes the specified contact from Google Contacts.",
  arguments: [
    {
      name: "resourceName",
      type: "string",
      userDescription: "Resource name of contact to delete.",
      aiDescription: "Contact resource identifier.",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson, userEmail } = config;
    const { resourceName } = args;

    const credentials = JSON.parse(serviceAccountJson);
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/contacts"],
      subject: userEmail,
    });

    const people = google.people({ version: "v1", auth });

    try {
      await people.people.deleteContact({
        resourceName,
      });

      return {
        results: { resourceName },
        log: { message: "Contact deleted." },
      };
    } catch (error) {
      return {
        results: {},
        log: { message: "Failed to delete contact.", data: error },
      };
    }
  },
};
