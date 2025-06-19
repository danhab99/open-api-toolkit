import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const updateGoogleContact: Tool = {
  name: "updateGoogleContact",
  userDescription: "Update an existing contact by resource name.",
  aiDescription: "Updates contact's name, email, and phone number.",
  arguments: [
    {
      name: "resourceName",
      type: "string",
      userDescription: "Resource name of contact (e.g. people/c12345).",
      aiDescription: "Contact resource identifier.",
    },
    {
      name: "etag",
      type: "string",
      userDescription: "ETag of the contact for concurrency.",
      aiDescription: "Contact version tag.",
    },
    {
      name: "givenName",
      type: "string",
      userDescription: "Updated first name.",
      aiDescription: "First name of contact.",
    },
    {
      name: "familyName",
      type: "string",
      userDescription: "Updated last name.",
      aiDescription: "Last name of contact.",
    },
    {
      name: "email",
      type: "string",
      userDescription: "Updated email.",
      aiDescription: "Primary email address.",
    },
    {
      name: "phoneNumber",
      type: "string",
      userDescription: "Updated phone number.",
      aiDescription: "Primary phone number.",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson, userEmail } = config;
    const { resourceName, etag, givenName, familyName, email, phoneNumber } =
      args;

    const credentials = JSON.parse(serviceAccountJson);
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/contacts"],
      subject: userEmail,
    });

    const people = google.people({ version: "v1", auth });

    try {
      const res = await people.people.updateContact({
        resourceName,
        updatePersonFields: "names,emailAddresses,phoneNumbers",
        requestBody: {
          etag,
          names: [{ givenName, familyName }],
          emailAddresses: email ? [{ value: email }] : [],
          phoneNumbers: phoneNumber ? [{ value: phoneNumber }] : [],
        },
      });

      return {
        results: { contact: res.data },
        log: { message: "Contact updated.", data: res.data },
      };
    } catch (error) {
      return {
        results: {},
        log: { message: "Failed to update contact.", data: error },
      };
    }
  },
};
