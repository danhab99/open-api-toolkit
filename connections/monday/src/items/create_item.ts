import { Tool, KVP } from "open-api-connection-types";
import { getClient, mondayApiCall } from "../lib";

export const createMondayItem: Tool = {
  id: "createMondayItem",
  displayName: "Create Item",
  userDescription: "Create a new item on a Monday.com board.",
  aiDescription:
    "Creates a new item (task, project, etc.) on a specified Monday.com board with an optional item name and column values.",
  arguments: [
    {
      id: "boardId",
      displayName: "Board ID",
      type: "string",
      userDescription: "ID of the Monday.com board.",
      aiDescription: "The unique identifier of the board where the item will be created.",
    },
    {
      id: "itemName",
      displayName: "Item Name",
      type: "string",
      userDescription: "Name of the item to create.",
      aiDescription: "The title/name of the new item.",
    },
    {
      id: "columnValues",
      displayName: "Column Values",
      type: "string",
      userDescription: "JSON string of column values (e.g., '{\"status\":\"Working on it\"}').",
      aiDescription: "Optional JSON string containing column IDs and their values to set on the new item.",
    },
  ],
  async handler(config: KVP, args: KVP) {
    const { boardId, itemName, columnValues } = args;
    const client = getClient(config);

    try {
      const query = `
        mutation ($boardId: ID!, $itemName: String!, $columnValues: JSON) {
          create_item (
            board_id: $boardId,
            item_name: $itemName,
            column_values: $columnValues
          ) {
            id
            name
            board {
              id
              name
            }
          }
        }
      `;

      const variables: any = {
        boardId: parseInt(boardId),
        itemName,
      };

      if (!variables.boardId || isNaN(variables.boardId)) {
        return {
          results: { success: false },
          log: {
            message: "Invalid board ID - must be a valid number",
            data: { boardId },
          },
        };
      }

      if (columnValues) {
        try {
          variables.columnValues = JSON.stringify(JSON.parse(columnValues));
        } catch (e) {
          return {
            results: { success: false },
            log: {
              message: "Invalid column values JSON format",
              data: e,
            },
          };
        }
      }

      const data = await mondayApiCall(client, query, variables);

      return {
        results: {
          item: data.create_item,
          success: true,
        },
        log: {
          message: `Item created successfully: ${itemName}`,
          data: data.create_item,
        },
      };
    } catch (error) {
      return {
        results: { success: false },
        log: {
          message: "Failed to create item",
          data: error,
        },
      };
    }
  },
};
