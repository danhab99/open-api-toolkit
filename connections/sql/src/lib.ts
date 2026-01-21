import { KVP } from "open-api-connection-types";
import mysql from "mysql2/promise";
import { Pool } from "pg";
import Database from "better-sqlite3";
import sql from "mssql";

export type SQLFlavor = "mysql" | "postgresql" | "sqlite" | "mssql";

export interface SQLConfig {
  flavor: SQLFlavor;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  filePath?: string; // for SQLite
}

export interface SQLClient {
  query(sql: string, params?: any[]): Promise<any>;
  close(): Promise<void>;
}

class MySQLClient implements SQLClient {
  private connection: mysql.Connection | null = null;

  constructor(private config: SQLConfig) {}

  async connect() {
    this.connection = await mysql.createConnection({
      host: this.config.host,
      port: this.config.port || 3306,
      database: this.config.database,
      user: this.config.username,
      password: this.config.password,
    });
  }

  async query(sql: string, params?: any[]): Promise<any> {
    if (!this.connection) {
      await this.connect();
    }
    const [rows] = await this.connection!.execute(sql, params);
    return rows;
  }

  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }
}

class PostgreSQLClient implements SQLClient {
  private pool: Pool | null = null;

  constructor(private config: SQLConfig) {}

  getPool() {
    if (!this.pool) {
      this.pool = new Pool({
        host: this.config.host,
        port: this.config.port || 5432,
        database: this.config.database,
        user: this.config.username,
        password: this.config.password,
      });
    }
    return this.pool;
  }

  async query(sql: string, params?: any[]): Promise<any> {
    const pool = this.getPool();
    const result = await pool.query(sql, params);
    return result.rows;
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

class SQLiteClient implements SQLClient {
  private db: Database.Database | null = null;

  constructor(private config: SQLConfig) {}

  getDB() {
    if (!this.db) {
      if (!this.config.filePath) {
        throw new Error("SQLite requires a filePath configuration");
      }
      this.db = new Database(this.config.filePath);
    }
    return this.db;
  }

  async query(sql: string, params?: any[]): Promise<any> {
    const db = this.getDB();
    const isSelect = sql.trim().toLowerCase().startsWith("select");
    if (isSelect) {
      return db.prepare(sql).all(params);
    } else {
      const stmt = db.prepare(sql);
      const result = stmt.run(params);
      return result;
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

class MSSQLClient implements SQLClient {
  private pool: sql.ConnectionPool | null = null;

  constructor(private config: SQLConfig) {}

  async getPool() {
    if (!this.pool) {
      this.pool = await sql.connect({
        server: this.config.host || "",
        port: this.config.port || 1433,
        database: this.config.database,
        user: this.config.username,
        password: this.config.password,
        options: {
          encrypt: true,
          trustServerCertificate: true,
        },
      });
    }
    return this.pool;
  }

  async query(sqlQuery: string, params?: any[]): Promise<any> {
    const pool = await this.getPool();
    const request = pool.request();
    
    // Add parameters if provided
    if (params) {
      params.forEach((param, index) => {
        request.input(`param${index}`, param);
      });
    }

    const result = await request.query(sqlQuery);
    return result.recordset;
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
    }
  }
}

export function getSQLConfig(config: KVP): SQLConfig {
  const { flavor, host, port, database, username, password, filePath } = config;
  
  if (!flavor) {
    throw new Error("SQL flavor configuration is required");
  }

  const sqlConfig: SQLConfig = {
    flavor: flavor as SQLFlavor,
    host: host as string,
    port: port ? parseInt(port as string, 10) : undefined,
    database: database as string,
    username: username as string,
    password: password as string,
    filePath: filePath as string,
  };

  return sqlConfig;
}

export function getSQLClient(config: KVP): SQLClient {
  const sqlConfig = getSQLConfig(config);

  switch (sqlConfig.flavor) {
    case "mysql":
      return new MySQLClient(sqlConfig);
    case "postgresql":
      return new PostgreSQLClient(sqlConfig);
    case "sqlite":
      return new SQLiteClient(sqlConfig);
    case "mssql":
      return new MSSQLClient(sqlConfig);
    default:
      throw new Error(`Unsupported SQL flavor: ${sqlConfig.flavor}`);
  }
}
