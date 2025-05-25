import path from "path";
import {
  OpenAPIConnection,
  OpenAPIConnectionDefinition,
} from "open-api-connector-types";
import * as fs from "fs/promises";
import { PrismaClient } from "open-api-db";

const cachedConnections: Record<string, OpenAPIConnectionDefinition> = {};

const db = new PrismaClient();

const CONNECTIONS_PER_PAGE = 20;

export async function createConnectionsManager(root: string) {
  return {
    async listAvaliableConnections(): Promise<OpenAPIConnectionDefinition[]> {
      const connectionDirs = await fs.readdir(root);

      const connetions: OpenAPIConnectionDefinition[] = await Promise.all(
        connectionDirs.map(
          (dir) =>
            this.importConnection(dir) as Promise<OpenAPIConnectionDefinition>,
        ),
      );

      return connetions;
    },

    async importConnection(
      connectionName: string,
    ): Promise<OpenAPIConnectionDefinition> {
      if (connectionName in cachedConnections) {
        return cachedConnections[connectionName];
      }

      const c: OpenAPIConnectionDefinition = await import(path.join(root));

      cachedConnections[connectionName] = c;
      return c;
    },

    async getMyConnection(id: number): Promise<OpenAPIConnection | undefined> {
      const connectionDB = await db.connection.findFirst({
        where: { id },
      });

      if (!connectionDB) {
        return undefined;
      }

      const mcp = await this.importConnection(connectionDB.connectionID);
      const config = JSON.parse(
        connectionDB.config,
      ) as OpenAPIConnection["config"];

      return {
        mcp,
        config,
        aiDescription: connectionDB.aiDescription,
        userDescription: connectionDB.userDescription,
        name: mcp.name,
        enabled: connectionDB.enable,
      } as OpenAPIConnection;
    },

    async getMyConnections(page: number = 0): Promise<OpenAPIConnection[]> {
      const connectionDBs = await db.connection.findMany({
        select: {
          id: true,
        },
        orderBy: {
          id: "asc",
        },
        skip: page * CONNECTIONS_PER_PAGE,
        take: CONNECTIONS_PER_PAGE,
      });

      return Promise.all(
        connectionDBs.map(async ({ id }) => {
          return this.getMyConnection(id) as Promise<OpenAPIConnection>;
        }),
      );
    },
  };
}
