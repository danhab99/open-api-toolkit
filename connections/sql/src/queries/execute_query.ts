import { Tool } from "open-api-connection-types";
import { getSQLClient, switchToDatabase } from "../lib";

export const executeQuery: Tool = {
  id: "executeQuery",
  displayName: "Execute SQL Query",
  userDescription: "Executes a SQL query on the configured database",
  aiDescription:
    "Executes a SQL query (SELECT, INSERT, UPDATE, DELETE) and returns the results. Supports parameterized queries for safety.",
  arguments: [
    {
      id: "query",
      displayName: "SQL Query",
      type: "string",
      userDescription: "The SQL query to execute",
      aiDescription:
        "The SQL query string to execute. Use parameter placeholders (?) for values to prevent SQL injection.",
    },
    {
      id: "parameters",
      displayName: "Query Parameters",
      type: "string",
      userDescription: "JSON array of query parameters (optional)",
      aiDescription:
        "Optional JSON array of parameters to bind to the query placeholders. Helps prevent SQL injection.",
    },
    {
      id: "database",
      displayName: "Database Name",
      type: "string",
      userDescription: "Specific database to use for this query (optional)",
      aiDescription:
        "Optional database name to use for this query. If specified, switches to this database before executing the query. Only supported for MySQL and MSSQL.",
    },
  ],
  async handler(config, args) {
    const client = getSQLClient(config);
    const { query, parameters, database } = args;
    const { flavor } = config;

    try {
      let params: any[] | undefined;
      if (parameters) {
        try {
          params = JSON.parse(parameters as string);
        } catch (e) {
          throw new Error("Invalid parameters format. Expected JSON array.");
        }
      }

      // Switch database if specified (only for MySQL and MSSQL)
      if (database) {
        await switchToDatabase(client, flavor as string, database as string);
      }

      const results = await client.query(query as string, params);
      await client.close();

      // Handle different result formats from different databases
      let rowCount = 0;
      if (Array.isArray(results)) {
        rowCount = results.length;
      } else if (results && typeof results === 'object') {
        // SQLite insert/update/delete returns { changes, lastInsertRowid }
        rowCount = results.changes || results.affectedRows || results.rowCount || 0;
      }

      return {
        results: {
          success: true,
          data: results,
          rowCount,
        },
        log: {
          message: `Query executed successfully`,
          data: {
            query,
            rowCount: Array.isArray(results) ? results.length : results.affectedRows || 0,
          },
        },
      };
    } catch (error) {
      await client.close();
      return {
        results: {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        log: {
          message: "Failed to execute query",
          data: error,
        },
      };
    }
  },
};
