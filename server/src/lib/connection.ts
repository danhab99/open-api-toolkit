import {
  OpenAPIConnection,
  OpenAPIConnectionDefinition,
} from "open-api-connector-types";
import { db } from "open-api-db";
import { Prisma } from "open-api-db/lib/generated/prisma/client";

import { Connection as GoogleConnection } from "@open-api-connection/google";
import getConfig from "next/config";

const CONNECTIONS_PER_PAGE = 20;

const Connections: OpenAPIConnectionDefinition[] = [GoogleConnection];

export async function listAvaliableConnections(): Promise<
  OpenAPIConnectionDefinition[]
> {
  return Connections;
}

var cachedConnections: Record<string, OpenAPIConnectionDefinition> = {};

export async function importConnections() {
  const {
    publicRuntimeConfig: { connectionPackages },
  } = getConfig()

  for (const pkg of connectionPackages as string[]) {
    // each package exports one thing named `shared`
    const mod = await import(pkg)
    cachedConnections[pkg] = mod.Connection as OpenAPIConnectionDefinition
  }

  return cachedConnections
}

export async function importConnection(
  connectionName: string,
): Promise<OpenAPIConnectionDefinition> {
  const x = Connections.find((x) => x.name === connectionName);
  if (x) return x;
  else throw "connection not found";
}

export async function getMyConnection(
  args: Prisma.ConnectionWhereInput,
): Promise<OpenAPIConnection | undefined> {
  const connectionDB = await db.connection.findFirst({
    where: args,
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

export async function getMyConnections(
  page: number = 0,
): Promise<OpenAPIConnection[]> {
  const connectionDBs = await db.connection.findMany({
    select: {
      connectionID: true,
    },
    orderBy: {
      id: "asc",
    },
    skip: page * CONNECTIONS_PER_PAGE,
    take: CONNECTIONS_PER_PAGE,
  });

  return Promise.all(
    connectionDBs.map(async (c) => {
      return getMyConnection({
        connectionID: c.connectionID,
      }) as Promise<OpenAPIConnection>;
    }),
  );
}
