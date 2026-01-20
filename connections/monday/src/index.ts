import { OpenAPIConnectionDefinition, Tool } from "open-api-connection-types";
import { createMondayItem } from "./items/create_item";
import { listMondayItems } from "./items/list_items";
import { updateMondayItem } from "./items/update_item";
import { deleteMondayItem } from "./items/delete_item";

export const Connection: OpenAPIConnectionDefinition = {
  id: "monday",
  displayName: "Monday.com",
  userDescription: "Connects to Monday.com using an API key",
  aiDescription: "Allows tools to manage Monday.com boards, items, and data on behalf of the user",
  configurationArguments: [
    {
      id: "apiKey",
      displayName: "API Key",
      userDescription: "Your Monday.com API key",
      aiDescription: "Authentication token for Monday.com API access",
      type: "string",
    },
    {
      id: "apiUrl",
      displayName: "API URL",
      userDescription: "Monday.com API endpoint URL (default: https://api.monday.com/v2)",
      aiDescription: "Base URL for Monday.com API requests, typically https://api.monday.com/v2",
      type: "string",
    },
  ],
};

export const Tools: Tool[] = [
  createMondayItem,
  listMondayItems,
  updateMondayItem,
  deleteMondayItem,
];
