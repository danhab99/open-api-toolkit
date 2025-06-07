import {
  OpenAPIConnection,
  OpenAPIConnectionDefinition,
} from "open-api-connector-types";
import { db } from "open-api-db";
import { Prisma } from "open-api-db/lib/generated/prisma/client";
import { Connection as GoogleConnection } from "@open-api-connection/google";

const CONNECTIONS_PER_PAGE = 20;

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD") // split accented characters into base + diacritics
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ""); // remove leading/trailing hyphens
}

export type OpenAPIConnectionDefinitionWithSlug =
  OpenAPIConnectionDefinition & {
    slug: string;
  };

export const Connections: OpenAPIConnectionDefinitionWithSlug[] = [
  GoogleConnection,
].map((x) => ({
  ...x,
  slug: slugify(x.name),
}));

export function importConnection(slug: string) {
  console.log("Connection", {
    Connections,
    slug,
    res: Connections.find((x) => x.slug === slug),
  });
  const x = Connections.find((x) => x.slug === slug);
  if (!x) throw "no connection found";
  return x;
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

  const mcp = importConnection(connectionDB.connectionID);
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
