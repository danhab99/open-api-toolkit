import { getMyConnection, getTools } from "@/lib/connection";
import { NextRequest, NextResponse } from "next/server";
import { KVP } from "open-api-connector-types";
import { db } from "open-api-db";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);

  const [, connectionID, , toolName] = url.pathname.split("/");

  const connectionInfo = await getMyConnection({
    connectionID,
  });
  if (!connectionInfo) {
    return new NextResponse("connection not found", {
      status: 404,
    });
  }

  const tools = await getTools(connectionID);
  const tool = tools.find((t) => t.name === toolName);
  if (!tool) {
    return new NextResponse("tool not found", {
      status: 404,
    });
  }

  const config: KVP = connectionInfo.config.reduce(
    (configObj, c) => ({
      ...configObj,
      [c.name]: c.value,
    }),
    {},
  );

  try {
    const results = await tool.handler(config, url.searchParams);

    if (results.log) {
      await db.auditLog.create({
        data: {
          connectionID: connectionInfo.db!.id,
          message: results.log?.message ?? `${connectionInfo.name} just ran`,
          data: results.log?.data,
        },
        select: {},
      });
    }

    return new NextResponse(JSON.stringify(results), {
      status: 200,
      statusText: `tool ${connectionID}/${toolName} ran successfully`,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e: any) {
    if (e) {
      await db.auditLog.create({
        data: {
          connectionID: connectionInfo.db!.id,
          message: `${connectionInfo.name} threw an exception`,
          data: e,
        },
        select: {},
      });
    }

    return new NextResponse(
      JSON.stringify({
        err: e,
        connectionId: connectionID,
      }),
      {
        status: 400,
        statusText: `tool ${connectionID}/${toolName} threw an error`,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
