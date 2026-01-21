import { Tool } from "open-api-connection-types";
import { getPeople } from "../lib";

export const listGoogleContacts: Tool = {
  id: "listGoogleContacts",
  displayName: "List Contacts",
  userDescription: "List contacts from Google Contacts.",
  aiDescription:
    "Retrieves contacts from Google Contacts, with optional max results.",
  arguments: [
    {
      id: "maxResults",
      displayName: "Max Results",
      type: "number",
      userDescription: "Maximum number of contacts to return.",
      aiDescription: "Limits number of contacts returned.",
    },
  ],
  async handler(config, args) {
    const { maxResults = 10 } = args;
    const people = getPeople(config);

    try {
      const res = await people.people.connections.list({
        resourceName: "people/me",
        pageSize: maxResults,
        personFields: "names,emailAddresses,phoneNumbers",
      });

      return {
        results: { contacts: res.data.connections || [] },
        log: {
          message: `Retrieved ${res.data.connections?.length || 0} contacts.`,
          data: res.data,
        },
      };
    } catch (error) {
      return {
        results: {},
        log: { message: "Failed to list contacts.", data: error },
      };
    }
  },
};
