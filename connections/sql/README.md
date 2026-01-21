# SQL Database Connector

A flexible SQL database connector that supports multiple SQL database flavors including MySQL, PostgreSQL, SQLite, and Microsoft SQL Server.

## Supported Databases

- **MySQL** - Popular open-source relational database
- **PostgreSQL** - Advanced open-source object-relational database
- **SQLite** - Lightweight file-based database
- **Microsoft SQL Server (MSSQL)** - Enterprise database solution

## Configuration

The SQL connector requires different configuration parameters depending on the database flavor:

### MySQL / PostgreSQL / MSSQL Configuration

- `flavor`: Database type (`mysql`, `postgresql`, or `mssql`)
- `host`: Database server hostname or IP address
- `port`: Database server port (default: 3306 for MySQL, 5432 for PostgreSQL, 1433 for MSSQL)
- `database`: Database name to connect to
- `username`: Database username for authentication
- `password`: Database password for authentication

### SQLite Configuration

- `flavor`: `sqlite`
- `filePath`: Path to the SQLite database file

## Available Tools

### 1. Execute Query

Execute any SQL query (SELECT, INSERT, UPDATE, DELETE) on the database.

**Arguments:**
- `query` (string): The SQL query to execute
- `parameters` (string, optional): JSON array of parameters for parameterized queries

**Example:**
```json
{
  "query": "SELECT * FROM users WHERE id = ?",
  "parameters": "[1]"
}
```

### 2. List Tables

List all tables in the database.

**Arguments:** None

**Returns:** Array of table names in the database

### 3. Describe Table

Get the schema/structure of a specific table including column names, types, and constraints.

**Arguments:**
- `tableName` (string): Name of the table to describe

**Returns:** Detailed column information for the specified table

## Security Best Practices

- Always use parameterized queries when including user input to prevent SQL injection
- Store database credentials securely
- Use read-only database users when only read access is needed
- Regularly update database client libraries

## Example Usage

### Setting up a MySQL Connection

1. Configure the connection with:
   - Flavor: `mysql`
   - Host: `localhost`
   - Port: `3306`
   - Database: `myapp`
   - Username: `appuser`
   - Password: `securepassword`

2. Use the "List Tables" tool to see available tables
3. Use "Describe Table" to understand table structure
4. Use "Execute Query" to interact with data

### Setting up a SQLite Connection

1. Configure the connection with:
   - Flavor: `sqlite`
   - File Path: `/path/to/database.db`

2. Use the same tools as above to interact with your SQLite database

## Dependencies

This connector uses the following npm packages:

- `mysql2` - MySQL client
- `pg` - PostgreSQL client
- `better-sqlite3` - SQLite client
- `mssql` - Microsoft SQL Server client

## Notes

- Connections are automatically closed after each operation
- All queries support parameterized values for security
- Different SQL flavors may have slight variations in query syntax
