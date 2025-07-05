import { Tool } from "open-api-connection-types";
import { getPeople } from "../lib";

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
    const { resourceName } = args;
    const people = getPeople(config);

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
