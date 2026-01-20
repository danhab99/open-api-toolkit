import { Tool, KVP } from "open-api-connection-types";
import { getClient, mondayApiCall } from "../lib";

export const updateMondayItem: Tool = {
  id: "updateMondayItem",
  displayName: "Update Item",
  userDescription: "Update an existing item on a Monday.com board.",
  aiDescription:
    "Updates an existing Monday.com item by changing its column values or name.",
  arguments: [
    {
      id: "boardId",
      displayName: "Board ID",
      type: "string",
      userDescription: "ID of the Monday.com board.",
      aiDescription: "The unique identifier of the board containing the item.",
    },
    {
      id: "itemId",
      displayName: "Item ID",
      type: "string",
      userDescription: "ID of the item to update.",
      aiDescription: "The unique identifier of the item to update.",
    },
    {
      id: "columnValues",
      displayName: "Column Values",
      type: "string",
      userDescription: "JSON string of column values to update (e.g., '{\"status\":\"Done\"}').",
      aiDescription: "JSON string containing column IDs and their new values.",
    },
  ],
  async handler(config: KVP, args: KVP) {
    const { boardId, itemId, columnValues } = args;
    const client = getClient(config);

    try {
      const query = `
        mutation ($boardId: ID!, $itemId: ID!, $columnValues: JSON!) {
          change_multiple_column_values (
            board_id: $boardId,
            item_id: $itemId,
            column_values: $columnValues
          ) {
            id
            name
            column_values {
              id
              text
              value
            }
          }
        }
      `;

      let parsedColumnValues;
      try {
        parsedColumnValues = JSON.parse(columnValues);
      } catch (e) {
        return {
          results: { success: false },
          log: {
            message: "Invalid column values JSON format",
            data: e,
          },
        };
      }

      const parsedBoardId = parseInt(boardId);
      const parsedItemId = parseInt(itemId);

      if (!parsedBoardId || isNaN(parsedBoardId)) {
        return {
          results: { success: false },
          log: {
            message: "Invalid board ID - must be a valid number",
            data: { boardId },
          },
        };
      }

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
        boardId: parsedBoardId,
        itemId: parsedItemId,
        columnValues: JSON.stringify(parsedColumnValues),
      };

      const data = await mondayApiCall(client, query, variables);

      return {
        results: {
          item: data.change_multiple_column_values,
          success: true,
        },
        log: {
          message: `Item ${itemId} updated successfully`,
          data: data.change_multiple_column_values,
        },
      };
    } catch (error) {
      return {
        results: { success: false },
        log: {
          message: "Failed to update item",
          data: error,
        },
      };
    }
  },
};
