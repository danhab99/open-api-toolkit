"use server";

import path from "path";
import { McpConnection, McpConnectionDefinition } from "open-api-connector-types";
import * as fs from "fs/promises";
import { PrismaClient } from "../../lib/generated/prisma/index.js";

const CONNECTIONS_PATH: string = path.join(__dirname, "../../../../../connections");

export async function listAvaliableConnections(): Promise<
  McpConnectionDefinition[]
> {
  const connectionDirs = await fs.readdir(CONNECTIONS_PATH);

  const connetions: McpConnectionDefinition[] = await Promise.all(
    connectionDirs.map(
      (dir) =>
        importConnectionFile(
          dir,
          "manifest.json",
        ) as Promise<McpConnectionDefinition>,
    ),
  );

  return connetions;
}

async function importConnectionFile(
  connectionName: string,
  file: string,
): Promise<Partial<McpConnectionDefinition>> {
  return require(path.join(CONNECTIONS_PATH, connectionName, file));
}

const cachedConnections: Record<
  Parameters<typeof importConnection>[0],
  Awaited<ReturnType<typeof importConnection>>
> = {};

export async function importConnection(
  connectionName: string,
): Promise<McpConnectionDefinition> {
  if (connectionName in cachedConnections) {
    return cachedConnections[connectionName];
  }

  const c = {
    ...(await importConnectionFile(connectionName, "manifest.json")),
    ...(await importConnectionFile(connectionName, "index.js")),
  } as McpConnectionDefinition;

  cachedConnections[connectionName] = c;
  return c;
}

const db = new PrismaClient();

const CONNECTIONS_PER_PAGE = 20;

export async function getMyConnections(
  page: number = 0,
): Promise<McpConnection[]> {
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
      return getMyConnection(id) as Promise<McpConnection>;
    }),
  );
}

export async function getMyConnection(
  id: McpConnection["id"],
): Promise<McpConnection | undefined> {
  const connectionDB = await db.connection.findFirst({
    where: { id },
  });

  if (!connectionDB) {
    return undefined;
  }

  const mcp = await importConnection(connectionDB.connectionID);
  const config = JSON.parse(connectionDB.config) as McpConnection["config"];

  return {
    mcp,
    config,
    aiDescription: connectionDB.aiDescription,
    userDescription: connectionDB.userDescription,
    name: mcp.name,
    enabled: connectionDB.enable,
  } as McpConnection;
}
