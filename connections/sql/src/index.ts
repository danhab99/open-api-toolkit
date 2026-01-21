import { OpenAPIConnectionDefinition, Tool } from "open-api-connection-types";
import { executeQuery } from "./queries/execute_query";
import { listTables } from "./queries/list_tables";
import { describeTable } from "./queries/describe_table";

export const Connection: OpenAPIConnectionDefinition = {
  id: "sql",
  displayName: "SQL Database",
  userDescription: "Connects to MySQL, PostgreSQL, SQLite, or MSSQL databases",
  aiDescription:
    "Allows tools to execute queries and manage data in SQL databases (MySQL, PostgreSQL, SQLite, MSSQL)",
  configurationArguments: [
    {
      id: "flavor",
      displayName: "Database Flavor",
      userDescription: "Type of SQL database (mysql, postgresql, sqlite, mssql)",
      aiDescription:
        "The SQL database type to connect to. Options: mysql, postgresql, sqlite, mssql",
      type: "string",
    },
    {
      id: "host",
      displayName: "Host",
      userDescription: "Database server hostname (not required for SQLite)",
      aiDescription:
        "The hostname or IP address of the database server. Not required for SQLite.",
      type: "string",
    },
    {
      id: "port",
      displayName: "Port",
      userDescription: "Database server port (not required for SQLite)",
      aiDescription:
        "The port number of the database server. Default: 3306 for MySQL, 5432 for PostgreSQL, 1433 for MSSQL. Not required for SQLite.",
      type: "number",
    },
    {
      id: "database",
      displayName: "Database Name",
      userDescription: "Name of the database to connect to",
      aiDescription: "The name of the database/schema to use",
      type: "string",
    },
    {
      id: "username",
      displayName: "Username",
      userDescription: "Database username (not required for SQLite)",
      aiDescription:
        "The username for database authentication. Not required for SQLite.",
      type: "string",
    },
    {
      id: "password",
      displayName: "Password",
      userDescription: "Database password (not required for SQLite)",
      aiDescription:
        "The password for database authentication. Not required for SQLite.",
      type: "string",
    },
    {
      id: "filePath",
      displayName: "File Path",
      userDescription: "Path to SQLite database file (only for SQLite)",
      aiDescription:
        "The file system path to the SQLite database file. Only required when flavor is sqlite.",
      type: "string",
    },
  ],
};

export const Tools: Tool[] = [
  executeQuery,
  listTables,
  describeTable,
];
