import { Tool } from "open-api-connection-types";
import { getSQLClient } from "../lib";

export const describeTable: Tool = {
  id: "describeTable",
  displayName: "Describe Table Schema",
  userDescription: "Gets the schema/structure of a specific table",
  aiDescription:
    "Retrieves detailed information about a table's columns, including names, types, and constraints.",
  arguments: [
    {
      id: "tableName",
      displayName: "Table Name",
      type: "string",
      userDescription: "Name of the table to describe",
      aiDescription: "The name of the database table to get schema information for",
    },
  ],
  async handler(config, args) {
    const client = getSQLClient(config);
    const { flavor } = config;
    const { tableName } = args;

    try {
      let query: string;
      let params: any[] | undefined;

      switch (flavor) {
        case "mysql":
          query = `DESCRIBE ${tableName}`;
          break;
        case "postgresql":
          // PostgreSQL uses $1 instead of ? - we'll let the client convert it
          query = `SELECT column_name, data_type, is_nullable, column_default 
                   FROM information_schema.columns 
                   WHERE table_name = ?`;
          params = [tableName];
          break;
        case "sqlite":
          query = `PRAGMA table_info(${tableName})`;
          break;
        case "mssql":
          // MSSQL will convert ? to @param0 in the client
          query = `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
                   FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_NAME = ?`;
          params = [tableName];
          break;
        default:
          throw new Error(`Unsupported SQL flavor: ${flavor}`);
      }

      const results = await client.query(query, params);
      await client.close();

      return {
        results: {
          success: true,
          tableName,
          columns: results,
          columnCount: Array.isArray(results) ? results.length : 0,
        },
        log: {
          message: `Retrieved schema for table: ${tableName}`,
          data: {
            tableName,
            columnCount: Array.isArray(results) ? results.length : 0,
          },
        },
      };
    } catch (error) {
      await client.close();
      return {
        results: {
          success: false,
          tableName,
          columns: [],
          error: error instanceof Error ? error.message : "Unknown error",
        },
        log: {
          message: `Failed to describe table: ${tableName}`,
          data: error,
        },
      };
    }
  },
};
