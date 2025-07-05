import { Tool } from "open-api-connection-types";
import { getPeople } from "../lib";

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
    const { givenName, familyName, email, phoneNumber } = args;
    const people = getPeople(config);

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
