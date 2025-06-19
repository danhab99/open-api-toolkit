import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { Tool } from "open-api-connection-types";

export const createGoogleContact: Tool = {
  name: "createGoogleContact",
  userDescription: "Create a new contact in Google Contacts.",
  aiDescription:
    "Creates a new contact with given names, email, and phone number.",
  arguments: [
    {
      name: "givenName",
      type: "string",
      userDescription: "Contact's first name.",
      aiDescription: "First name of contact.",
    },
    {
      name: "familyName",
      type: "string",
      userDescription: "Contact's last name.",
      aiDescription: "Last name of contact.",
    },
    {
      name: "email",
      type: "string",
      userDescription: "Contact's email address.",
      aiDescription: "Primary email.",
    },
    {
      name: "phoneNumber",
      type: "string",
      userDescription: "Contact's phone number.",
      aiDescription: "Primary phone number.",
    },
  ],
  async handler(config, args) {
    const { serviceAccountJson, userEmail } = config;
    const { givenName, familyName, email, phoneNumber } = args;

    const credentials = JSON.parse(serviceAccountJson);
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/contacts"],
      subject: userEmail,
    });

    const people = google.people({ version: "v1", auth });

    try {
      const res = await people.people.createContact({
        requestBody: {
          names: [{ givenName, familyName }],
          emailAddresses: email ? [{ value: email }] : [],
          phoneNumbers: phoneNumber ? [{ value: phoneNumber }] : [],
        },
      });

      return {
        results: { contact: res.data },
        log: { message: "Contact created.", data: res.data },
      };
    } catch (error) {
      return {
        results: {},
        log: { message: "Failed to create contact.", data: error },
      };
    }
  },
};
