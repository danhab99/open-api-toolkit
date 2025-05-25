"use server";

import path from "path";
import {
  OpenAPIConnection,
  OpenAPIConnectionDefinition,
} from "open-api-connector-types";
import * as fs from "fs/promises";
import { PrismaClient } from "open-api-db";

const CONNECTIONS_PATH: string = path.join(
  __dirname,
  "../../../../../connections",
);

export async function listAvaliableConnections(): Promise<
  OpenAPIConnectionDefinition[]
> {
  const connectionDirs = await fs.readdir(CONNECTIONS_PATH);

  const connetions: OpenAPIConnectionDefinition[] = await Promise.all(
    connectionDirs.map(
      (dir) => importConnection(dir) as Promise<OpenAPIConnectionDefinition>,
    ),
  );

  return connetions;
}

const cachedConnections: Record<
  Parameters<typeof importConnection>[0],
  Awaited<ReturnType<typeof importConnection>>
> = {};

export async function importConnection(
  connectionName: string,
): Promise<OpenAPIConnectionDefinition> {
  if (connectionName in cachedConnections) {
    return cachedConnections[connectionName];
  }

  const c: OpenAPIConnectionDefinition = await import(
    path.join(CONNECTIONS_PATH, connectionName)
  );

  cachedConnections[connectionName] = c;
  return c;
}

const db = new PrismaClient();

const CONNECTIONS_PER_PAGE = 20;

export async function getMyConnections(
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
    connectionDBs.map(async ({ id }) => {
      return getMyConnection(id) as Promise<OpenAPIConnection>;
    }),
  );
}

export async function getMyConnection(
  id: OpenAPIConnection["id"],
): Promise<OpenAPIConnection | undefined> {
  const connectionDB = await db.connection.findFirst({
    where: { id },
  });

  if (!connectionDB) {
    return undefined;
  }

  const mcp = await importConnection(connectionDB.connectionID);
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
