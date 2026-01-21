# SQL Database Connector

A flexible SQL database connector that supports multiple SQL database flavors including MySQL, PostgreSQL, SQLite, and Microsoft SQL Server, with the ability to access multiple databases on the same server.

## Supported Databases

- **MySQL** - Popular open-source relational database
- **PostgreSQL** - Advanced open-source object-relational database
- **SQLite** - Lightweight file-based database
- **Microsoft SQL Server (MSSQL)** - Enterprise database solution

## Key Features

✨ **Multi-Database Access**: Access all databases on a server (MySQL, MSSQL)
🔄 **Dynamic Database Switching**: Switch between databases during runtime
📊 **Database Discovery**: List all available databases on the server
🔒 **Secure Parameterized Queries**: Prevent SQL injection attacks

## Configuration

The SQL connector requires different configuration parameters depending on the database flavor:

### MySQL / PostgreSQL / MSSQL Configuration

- `flavor`: Database type (`mysql`, `postgresql`, or `mssql`)
- `host`: Database server hostname or IP address
- `port`: Database server port (default: 3306 for MySQL, 5432 for PostgreSQL, 1433 for MSSQL)
- `database`: Default database name to connect to (optional - can be omitted for server-level access)
- `username`: Database username for authentication
- `password`: Database password for authentication

### SQLite Configuration

- `flavor`: `sqlite`
- `filePath`: Path to the SQLite database file

## Available Tools

### 1. List Databases

List all databases available on the server that the user has permissions to access.

**Arguments:** None

**Returns:** Array of database names

**Supported:** MySQL, PostgreSQL, MSSQL (SQLite returns its single file-based database)

**Example:**
```json
{
  "results": {
    "databases": ["myapp_prod", "myapp_dev", "analytics"],
    "databaseCount": 3
  }
}
```

### 2. Switch Database

Switch to a different database on the same server (MySQL and MSSQL only).

**Arguments:**
- `databaseName` (string): Name of the database to switch to

**Returns:** Success status and database name

**Note:** PostgreSQL requires database selection at connection time. SQLite doesn't support this.

### 3. Execute Query

Execute any SQL query (SELECT, INSERT, UPDATE, DELETE) on the database.

**Arguments:**
- `query` (string): The SQL query to execute
- `parameters` (string, optional): JSON array of parameters for parameterized queries
- `database` (string, optional): Specific database to use for this query (MySQL/MSSQL only)

**Example:**
```json
{
  "query": "SELECT * FROM users WHERE id = ?",
  "parameters": "[1]",
  "database": "myapp_prod"
}
```

### 4. List Tables

List all tables in the database.

**Arguments:**
- `database` (string, optional): Specific database to list tables from (MySQL/MSSQL only)

**Returns:** Array of table names in the database

### 5. Describe Table

Get the schema/structure of a specific table including column names, types, and constraints.

**Arguments:**
- `tableName` (string): Name of the table to describe
- `database` (string, optional): Specific database containing the table (MySQL/MSSQL only)

**Returns:** Detailed column information for the specified table

## Security Best Practices

- Always use parameterized queries when including user input to prevent SQL injection
- Store database credentials securely
- Use read-only database users when only read access is needed
- Regularly update database client libraries

## Example Usage

### Setting up a MySQL Connection with Multi-Database Access

1. Configure the connection with:
   - Flavor: `mysql`
   - Host: `localhost`
   - Port: `3306`
   - Database: (leave empty or specify a default)
   - Username: `appuser`
   - Password: `securepassword`

2. Use the "List Databases" tool to see all available databases
3. Use "List Tables" with a specific database to see tables
4. Use "Execute Query" with the `database` parameter to query any database

### Working with Multiple Databases

```javascript
// List all databases
listDatabases() → ["db1", "db2", "db3"]

// Query a specific database
executeQuery({
  query: "SELECT * FROM users",
  database: "db1"
})

// Switch to a database for multiple operations
switchDatabase({ databaseName: "db2" })
listTables()
```

### Setting up a SQLite Connection

1. Configure the connection with:
   - Flavor: `sqlite`
   - File Path: `/path/to/database.db`

2. Use the same query tools (SQLite doesn't support multi-database features)

## Database-Specific Features

### MySQL
- ✅ List databases
- ✅ Switch databases
- ✅ Per-query database selection
- Connection can access all databases with appropriate permissions

### PostgreSQL
- ✅ List databases
- ❌ Runtime database switching (requires new connection)
- ❌ Per-query database selection
- Connections are database-specific but can list other databases

### MSSQL
- ✅ List databases
- ✅ Switch databases
- ✅ Per-query database selection
- Connection can access all databases with appropriate permissions

### SQLite
- ⚠️ File-based, single database per connection
- ❌ Multi-database features not applicable
- Create separate connections for different database files

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
