import { getMyConnection, importConnection } from "@/lib/connection";
import { NextRequest, NextResponse } from "next/server";
import { KVP } from "open-api-connector-types";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);

  const [, connectionID, , toolName] = url.pathname.split("/");

  const connectionInfo = await getMyConnection(__dirname, {
    connectionID,
  });

  if (!connectionInfo) {
    return new NextResponse("connection not found", {
      status: 404,
    });
  }

  const connection = await importConnection(__dirname, connectionInfo.mcp.name);

  const tool = connection.tools.find((t) => t.name === toolName);

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

  const results = await tool.handler(config, url.searchParams);

  return new NextResponse(JSON.stringify(results), {
    status: 200,
    statusText: `tool ${connectionID}/${toolName} ran successfully`,
  });
}
