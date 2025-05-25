import path from "path";
import {
  OpenAPIConnection,
  OpenAPIConnectionDefinition,
} from "open-api-connector-types";
import * as fs from "fs/promises";
import { PrismaClient } from "open-api-db";
import { Prisma } from "open-api-db/lib/generated/prisma/client";

const cachedConnections: Record<string, OpenAPIConnectionDefinition> = {};

const db = new PrismaClient();

const CONNECTIONS_PER_PAGE = 20;

export async function listAvaliableConnections(
  root: string,
): Promise<OpenAPIConnectionDefinition[]> {
  const connectionDirs = await fs.readdir(root);

  const connetions: OpenAPIConnectionDefinition[] = await Promise.all(
    connectionDirs.map(
      (dir) =>
        this.importConnection(dir) as Promise<OpenAPIConnectionDefinition>,
    ),
  );

  return connetions;
}

export async function importConnection(
  root: string,
  connectionName: string,
): Promise<OpenAPIConnectionDefinition> {
  if (connectionName in cachedConnections) {
    return cachedConnections[connectionName];
  }

  const c: OpenAPIConnectionDefinition = await import(path.join(root));

  cachedConnections[connectionName] = c;
  return c;
}

export async function getMyConnection(
  root: string,
  args: Prisma.ConnectionWhereInput,
): Promise<OpenAPIConnection | undefined> {
  const connectionDB = await db.connection.findFirst({
    where: args,
  });

  if (!connectionDB) {
    return undefined;
  }

  const mcp = await importConnection(root, connectionDB.connectionID);
  const config = JSON.parse(connectionDB.config) as OpenAPIConnection["config"];

  return {
    mcp,
    config,
    aiDescription: connectionDB.aiDescription,
    userDescription: connectionDB.userDescription,
    name: mcp.name,
    enabled: connectionDB.enable,
  } as OpenAPIConnection;
}

export async function getMyConnections(
  root: string,
  page: number = 0,
): Promise<OpenAPIConnection[]> {
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
    connectionDBs.map(async (c) => {
      return getMyConnection(root, c.name) as Promise<OpenAPIConnection>;
    }),
  );
}
