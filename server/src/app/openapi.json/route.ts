"use server";
import { getMyConnections, getTools } from "@/lib/connection";
import { NextResponse } from "next/server";

export async function GET() {
  const connections = await getMyConnections();

  const paths: Record<string, any> = {};

  for (const connection of connections) {
    paths[`/llm/${connection.name}`] = {
      summary: connection.aiDescription,
    };

    const tools = await getTools(connection.def.id)

    for (const r of tools) {
      paths[`/tool/${connection.name}/${r.name}`] = {
        post: {
          parameters: r.arguments.map((arg) => ({
            name: arg.name,
            description: arg.aiDescription,
            in: "query",
            schema: {
              type: arg.type,
            },
          })),
          summary: r.aiDescription,
        },
      };
    }
  }

  return new NextResponse(
    JSON.stringify({
      openapi: "3.0.3",
      info: "",
      paths: paths,
    }),
  );
}
