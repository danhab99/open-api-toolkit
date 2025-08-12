"use strict";

import { KVP } from "open-api-connector-types";
import { getMyConnection, getTools } from "./connection";
import { db } from "open-api-db";
export async function executeToolCall(
  connectionID: number,
  toolId: string,
  args: KVP,
) {
  console.log("Starting execution of tool call");

  const connectionInfo = await getMyConnection({
    id: connectionID,
  });
  if (!connectionInfo) {
    throw "connection not found";
  }
  console.log(`Found connection info with ID ${connectionInfo.id}`);

  const tools = await getTools(connectionInfo.def.id);
  if (!tools || tools.length == 0) {
    throw "conenction not found";
  }
  console.log(
    `Found ${tools.length} tool${tools.length === 1 ? "" : "s"} for connection`,
  );

  const tool = tools.find((t) => t.id == toolId);
  if (!tool) {
    throw "tool not found";
  }
  console.log(`Found tool with ID ${tool.id}`);

  const config: KVP = connectionInfo.config.reduce(
    (configObj, c) => ({
      ...configObj,
      [c.id]: c.value,
    }),
    {},
  );
  console.log(`Config for tool is ${JSON.stringify(config)}`);

  try {
    const results = await tool.handler(config, args);
    await db.auditLog.create({
      data: {
        connectionID: connectionInfo.db!.id,
        message:
          results.log?.message ?? `${connectionInfo.displayName} just ran`,
        data: JSON.stringify(results.log?.data ?? {}),
      },
    });
    console.log("Tool call executed successfully");
    return results;
  } catch (e: any) {
    await db.auditLog.create({
      data: {
        connectionID: connectionInfo.db!.id,
        message: `${connectionInfo.displayName} threw an exception`,
        data: JSON.stringify(e ?? {}),
      },
    });
    console.log("Tool call failed with error");
    throw e;
  }
}
