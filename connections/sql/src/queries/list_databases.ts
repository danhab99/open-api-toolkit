import { Tool } from "open-api-connection-types";
import { getSQLClient, getSQLConfig } from "../lib";

export const listDatabases: Tool = {
  id: "listDatabases",
  displayName: "List Databases",
  userDescription: "Lists all databases available on the server",
  aiDescription:
    "Retrieves a list of all databases on the server that the user has permission to access. Different SQL flavors use different system queries.",
  arguments: [],
  async handler(config, args) {
    const client = getSQLClient(config);
    const { flavor } = config;

    try {
      let query: string;
      
      switch (flavor) {
        case "mysql":
          query = "SHOW DATABASES";
          break;
        case "postgresql":
          query = "SELECT datname FROM pg_database WHERE datistemplate = false";
          break;
        case "sqlite":
          // SQLite doesn't have the concept of multiple databases on a server
          const sqlConfig = getSQLConfig(config);
          const dbName = sqlConfig.filePath ? sqlConfig.filePath.split('/').pop() : 'database';
          return {
            results: {
              success: true,
              databases: [dbName],
              databaseCount: 1,
              note: "SQLite uses file-based databases. Only the configured database file is accessible.",
            },
            log: {
              message: "SQLite database listed",
              data: { database: dbName },
            },
          };
        case "mssql":
          query = "SELECT name FROM sys.databases WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb')";
          break;
        default:
          throw new Error(`Unsupported SQL flavor: ${flavor}`);
      }

      const results = await client.query(query);
      await client.close();

      // Normalize results to always return array of database names
      let databases: string[] = [];
      if (Array.isArray(results)) {
        if (results.length > 0) {
          const firstKey = Object.keys(results[0])[0];
          databases = results.map((row: any) => row[firstKey]);
        }
      }

      return {
        results: {
          success: true,
          databases,
          databaseCount: databases.length,
        },
        log: {
          message: `Found ${databases.length} databases on server`,
          data: {
            databaseCount: databases.length,
          },
        },
      };
    } catch (error) {
      await client.close();
      return {
        results: {
          success: false,
          databases: [],
          error: error instanceof Error ? error.message : "Unknown error",
        },
        log: {
          message: "Failed to list databases",
          data: error,
        },
      };
    }
  },
};
