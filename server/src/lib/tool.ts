"use server";
import { KVP } from "open-api-connector-types";
import { getMyConnection, getTools } from "./connection";
import { db } from "open-api-db";

export async function executeToolCall(
  connectionID: number,
  toolName: string,
  args: KVP,
) {
  console.log("!!!", { connectionID });
  const connectionInfo = await getMyConnection({
    id: connectionID,
  });
  if (!connectionInfo) {
    throw "connection not found";
  }
  console.log("!!!", { connectionInfo });

  const tools = await getTools(connectionInfo.def.id);
  const tool = tools.find((t) => t.name === toolName);
  if (!tool) {
    throw "tool not found";
  }
  console.log("!!!", { tools, tool, toolName });

  const config: KVP = connectionInfo.config.reduce(
    (configObj, c) => ({
      ...configObj,
      [c.name]: c.value,
    }),
    {},
  );
  console.log("!!!", { config });

  console.log("Executing tool call", { connectionID, toolName, config });

  try {
    const results = await tool.handler(config, args);
    console.log("!!!", { results });

    await db.auditLog.create({
      data: {
        connectionID: connectionInfo.db!.id,
        message: results.log?.message ?? `${connectionInfo.name} just ran`,
        data: JSON.stringify(results.log?.data ?? {}),
      },
    });

    return results;
  } catch (e: any) {
    console.log("!!!", { e });
    await db.auditLog.create({
      data: {
        connectionID: connectionInfo.db!.id,
        message: `${connectionInfo.name} threw an exception`,
        data: JSON.stringify(e ?? {}),
      },
    });

    throw e;
  }
}
