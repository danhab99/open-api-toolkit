import { Tool, KVP } from "open-api-connection-types";
import { getClient, mondayApiCall } from "../lib";

export const listMondayItems: Tool = {
  id: "listMondayItems",
  displayName: "List Items",
  userDescription: "List items from a Monday.com board.",
  aiDescription:
    "Retrieves a list of items from a specified Monday.com board, optionally limiting the number of results.",
  arguments: [
    {
      id: "boardId",
      displayName: "Board ID",
      type: "string",
      userDescription: "ID of the Monday.com board.",
      aiDescription: "The unique identifier of the board to list items from.",
    },
    {
      id: "limit",
      displayName: "Limit",
      type: "number",
      userDescription: "Maximum number of items to return (default: 25).",
      aiDescription: "Optional maximum number of items to retrieve.",
    },
  ],
  async handler(config: KVP, args: KVP) {
    const { boardId, limit = 25 } = args;
    const client = getClient(config);

    try {
      const query = `
        query ($boardId: [ID!], $limit: Int) {
          boards (ids: $boardId) {
            id
            name
            items_page (limit: $limit) {
              items {
                id
                name
                state
                created_at
                updated_at
                column_values {
                  id
                  text
                  value
                }
              }
            }
          }
        }
      `;

      const parsedBoardId = parseInt(boardId);
      const parsedLimit = typeof limit === 'number' ? limit : parseInt(limit.toString());

      if (!parsedBoardId || isNaN(parsedBoardId)) {
        return {
          results: { success: false },
          log: {
            message: "Invalid board ID - must be a valid number",
            data: { boardId },
          },
        };
      }

      if (isNaN(parsedLimit)) {
        return {
          results: { success: false },
          log: {
            message: "Invalid limit - must be a valid number",
            data: { limit },
          },
        };
      }

      const variables = {
        boardId: [parsedBoardId],
        limit: parsedLimit,
      };

      const data = await mondayApiCall(client, query, variables);

      const items = data.boards?.[0]?.items_page?.items || [];

      return {
        results: {
          items,
          count: items.length,
          success: true,
        },
        log: {
          message: `Retrieved ${items.length} items from board ${boardId}`,
          data: { boardId, itemCount: items.length },
        },
      };
    } catch (error) {
      return {
        results: { success: false },
        log: {
          message: "Failed to list items",
          data: error,
        },
      };
    }
  },
};
