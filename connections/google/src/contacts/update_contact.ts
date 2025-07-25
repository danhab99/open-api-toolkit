import { Tool } from "open-api-connection-types";
import { getPeople } from "../lib";

export const updateGoogleContact: Tool = {
  displayName: "Update contact",
  id: "updateGoogleContact",
  userDescription: "Update an existing contact by resource name.",
  aiDescription: "Updates contact's name, email, and phone number.",
  arguments: [
    {
      id: "resourceName",
      displayName: "Resource Name",
      type: "string",
      userDescription: "Resource name of contact (e.g. people/c12345).",
      aiDescription: "Contact resource identifier.",
    },
    {
      id: "etag",
      displayName: "ETag",
      type: "string",
      userDescription: "ETag of the contact for concurrency.",
      aiDescription: "Contact version tag.",
    },
    {
      id: "givenName",
      displayName: "Given Name",
      type: "string",
      userDescription: "Updated first name.",
      aiDescription: "First name of contact.",
    },
    {
      id: "familyName",
      displayName: "Family Name",
      type: "string",
      userDescription: "Updated last name.",
      aiDescription: "Last name of contact.",
    },
    {
      id: "email",
      displayName: "Email",
      type: "string",
      userDescription: "Updated email.",
      aiDescription: "Primary email address.",
    },
    {
      id: "phoneNumber",
      displayName: "Phone Number",
      type: "string",
      userDescription: "Updated phone number.",
      aiDescription: "Primary phone number.",
    },
  ],
  async handler(config, args) {
    const { resourceName, etag, givenName, familyName, email, phoneNumber } =
      args;

    const people = getPeople(config);

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
