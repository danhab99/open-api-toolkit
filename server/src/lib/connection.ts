"use server";

import path from "path";
import { McpConnectionDefinition } from "../types.js";
import * as fs from "fs/promises";

const CONNECTIONS_PATH: string = "";

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

export async function importConnection(
  connectionName: string,
): Promise<Partial<McpConnectionDefinition>> {
  return {
    ...(await importConnectionFile(connectionName, "manifest.json")),
    ...(await importConnectionFile(connectionName, "index.js")),
  };
}
