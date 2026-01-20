import { Tool } from "open-api-connection-types";
import { getClient, mondayApiCall } from "../lib";

export const deleteMondayItem: Tool = {
  id: "deleteMondayItem",
  displayName: "Delete Item",
  userDescription: "Delete an item from a Monday.com board.",
  aiDescription:
    "Deletes an existing item from a Monday.com board by its ID.",
  arguments: [
    {
      id: "itemId",
      displayName: "Item ID",
      type: "string",
      userDescription: "ID of the item to delete.",
      aiDescription: "The unique identifier of the item to delete.",
    },
  ],
  async handler(config, args) {
    const { itemId } = args;
    const client = getClient(config);

    try {
      const query = `
        mutation ($itemId: ID!) {
          delete_item (item_id: $itemId) {
            id
          }
        }
      `;

      const parsedItemId = parseInt(itemId);

      if (!parsedItemId || isNaN(parsedItemId)) {
        return {
          results: { success: false },
          log: {
            message: "Invalid item ID - must be a valid number",
            data: { itemId },
          },
        };
      }

      const variables = {
        itemId: parsedItemId,
      };

      const data = await mondayApiCall(client, query, variables);

      return {
        results: {
          deletedItemId: data.delete_item?.id,
          success: true,
        },
        log: {
          message: `Item ${itemId} deleted successfully`,
          data: data.delete_item,
        },
      };
    } catch (error) {
      return {
        results: { success: false },
        log: {
          message: "Failed to delete item",
          data: error,
        },
      };
    }
  },
};
