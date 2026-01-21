import { Tool } from "open-api-connection-types";
import { getSQLClient, switchToDatabase } from "../lib";

export const listTables: Tool = {
  id: "listTables",
  displayName: "List Database Tables",
  userDescription: "Lists all tables in the configured database",
  aiDescription:
    "Retrieves a list of all tables in the database. Different SQL flavors use different system queries.",
  arguments: [
    {
      id: "database",
      displayName: "Database Name",
      type: "string",
      userDescription: "Specific database to list tables from (optional)",
      aiDescription:
        "Optional database name to list tables from. If not specified, uses the configured database. Only supported for MySQL and MSSQL.",
    },
  ],
  async handler(config, args) {
    const client = getSQLClient(config);
    const { flavor } = config;
    const { database } = args;

    try {
      // Switch database if specified (only for MySQL and MSSQL)
      if (database) {
        await switchToDatabase(client, flavor as string, database as string);
      }

      let query: string;
      
      switch (flavor) {
        case "mysql":
          query = "SHOW TABLES";
          break;
        case "postgresql":
          query = "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema')";
          break;
        case "sqlite":
          query = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'";
          break;
        case "mssql":
          query = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'";
          break;
        default:
          throw new Error(`Unsupported SQL flavor: ${flavor}`);
      }

      const results = await client.query(query);
      await client.close();

      // Normalize results to always return array of table names
      let tables: string[] = [];
      if (Array.isArray(results)) {
        if (results.length > 0) {
          const firstKey = Object.keys(results[0])[0];
          tables = results.map((row: any) => row[firstKey]);
        }
      }

      return {
        results: {
          success: true,
          tables,
          tableCount: tables.length,
        },
        log: {
          message: `Found ${tables.length} tables in database`,
          data: {
            tableCount: tables.length,
          },
        },
      };
    } catch (error) {
      await client.close();
      return {
        results: {
          success: false,
          tables: [],
          error: error instanceof Error ? error.message : "Unknown error",
        },
        log: {
          message: "Failed to list tables",
          data: error,
        },
      };
    }
  },
};
