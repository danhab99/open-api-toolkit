"use server";
import { KVP } from "open-api-connector-types";
import { getMyConnection, getTools } from "./connection";
import { db } from "open-api-db";

export async function executeToolCall(
  connectionID: number,
  toolId: string,
  args: KVP,
) {
  const connectionInfo = await getMyConnection({
    id: connectionID,
  });
  if (!connectionInfo) {
    throw "connection not found";
  }

  const tools = await getTools(connectionInfo.def.id);
  const tool = tools.find((t) => t.id == toolId);
  if (!tool) {
    throw "tool not found";
  }

  const config: KVP = connectionInfo.config.reduce(
    (configObj, c) => ({
      ...configObj,
      [c.id]: c.value,
    }),
    {},
  );

  try {
    const results = await tool.handler(config, args);

    await db.auditLog.create({
      data: {
        connectionID: connectionInfo.db!.id,
        message: results.log?.message ?? `${connectionInfo.displayName} just ran`,
        data: JSON.stringify(results.log?.data ?? {}),
      },
    });

    return results;
  } catch (e: any) {
    await db.auditLog.create({
      data: {
        connectionID: connectionInfo.db!.id,
        message: `${connectionInfo.displayName} threw an exception`,
        data: JSON.stringify(e ?? {}),
      },
    });

    throw e;
  }
}
