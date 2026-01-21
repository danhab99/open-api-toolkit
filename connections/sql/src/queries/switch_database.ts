import { Tool } from "open-api-connection-types";
import { getSQLClient, getSQLConfig } from "../lib";

export const switchDatabase: Tool = {
  id: "switchDatabase",
  displayName: "Switch Database",
  userDescription: "Switches to a different database on the same server",
  aiDescription:
    "Changes the active database context to a different database on the same server. Not applicable for SQLite.",
  arguments: [
    {
      id: "databaseName",
      displayName: "Database Name",
      type: "string",
      userDescription: "Name of the database to switch to",
      aiDescription: "The name of the database to use for subsequent queries",
    },
  ],
  async handler(config, args) {
    const { flavor } = config;
    const { databaseName } = args;

    // SQLite doesn't support switching databases
    if (flavor === "sqlite") {
      return {
        results: {
          success: false,
          error: "SQLite uses file-based databases and does not support switching databases. Create a new connection for a different database file.",
        },
        log: {
          message: "Database switching not supported for SQLite",
          data: { flavor },
        },
      };
    }

    const client = getSQLClient(config);

    try {
      let query: string;
      
      switch (flavor) {
        case "mysql":
          query = `USE \`${databaseName}\``;
          break;
        case "postgresql":
          // PostgreSQL doesn't support USE statement, connections are database-specific
          return {
            results: {
              success: false,
              error: "PostgreSQL requires database selection at connection time. Create a new connection with the desired database.",
              suggestion: "Update the connection configuration to specify the target database.",
            },
            log: {
              message: "PostgreSQL does not support runtime database switching",
              data: { flavor, databaseName },
            },
          };
        case "mssql":
          query = `USE [${databaseName}]`;
          break;
        default:
          throw new Error(`Unsupported SQL flavor: ${flavor}`);
      }

      await client.query(query);
      await client.close();

      return {
        results: {
          success: true,
          database: databaseName,
        },
        log: {
          message: `Switched to database: ${databaseName}`,
          data: {
            database: databaseName,
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
          message: `Failed to switch to database: ${databaseName}`,
          data: error,
        },
      };
    }
  },
};
