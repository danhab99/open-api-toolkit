"use server";
import {
  OpenAPIConnection,
  OpenAPIConnectionDefinition,
} from "open-api-connector-types";
import { db } from "open-api-db";
import { Prisma } from "open-api-db/lib/generated/prisma/client";
import {
  Connection as GoogleConnection,
  Tools as GoogleTools,
} from "@open-api-connection/google";

const CONNECTIONS_PER_PAGE = 20;

export async function getAllConnections() {
  const Connections: OpenAPIConnectionDefinition[] = [GoogleConnection];

  return Connections;
}

export async function importConnection(id: string) {
  const Connections = await getAllConnections();
  const x = Connections.find((x) => x.id === id);
  if (!x) throw "no connection found";

  return JSON.parse(JSON.stringify(x));
}

export async function getTools(id: string) {
  const Tools = {
    [GoogleConnection.id]: GoogleTools,
  };

  return Tools[id];
}

export async function getMyConnection(
  args: Prisma.ConnectionWhereInput,
): Promise<
  | (OpenAPIConnection & {
      db: Awaited<ReturnType<typeof db.connection.findFirst>>;
    })
  | undefined
> {
  const connectionDB = await db.connection.findFirstOrThrow({
    where: args,
  });

  const def = await importConnection(connectionDB.connectionID);
  const config = JSON.parse(connectionDB.config) as OpenAPIConnection["config"];

  return {
    id: connectionDB.id,
    slug: "",
    db: connectionDB,
    def,
    config,
    aiDescription: connectionDB.aiDescription,
    userDescription: connectionDB.userDescription,
    name: def.name,
    enabled: connectionDB.enable,
  };
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

export async function createConnection(
  conn: Omit<OpenAPIConnection, "id" | "slug">,
) {
  const res = await db.connection.create({
    data: {
      aiDescription: conn.aiDescription,
      connectionID: conn.def.id,
      config: JSON.stringify(conn.config),
      enable: true,
      userDescription: conn.userDescription,
    },
    select: {
      id: true,
    },
  });

  return res.id;
}

export async function enableConnection(connectionID: string, enable: boolean) {
  const r = await db.connection.findFirstOrThrow({
    where: {
      connectionID,
    },
    select: {
      id: true,
    },
  });

  await db.connection.update({
    data: {
      enable,
    },
    where: {
      id: r!.id,
    },
  });
}

export async function deleteConnection(connectionID: string) {
  const r = await db.connection.findFirstOrThrow({
    where: {
      connectionID,
    },
    select: {
      id: true,
    },
  });
  await db.connection.delete({
    where: { id: r!.id },
  });
}

export async function editConnection(
  connectionID: string,
  change: Partial<OpenAPIConnection>,
) {
  const r = await db.connection.findFirstOrThrow({
    where: {
      connectionID,
    },
    select: {
      id: true,
    },
  });

  await db.connection.update({
    where: { id: r!.id },
    data: {
      aiDescription: change.aiDescription,
      config: JSON.stringify(change.config),
      userDescription: change.userDescription,
    },
  });
}
