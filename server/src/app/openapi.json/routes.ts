import { listAvaliableConnections } from "@/lib/connection";
import { NextResponse } from "next/server";

export async function GET() {
  const connections = await listAvaliableConnections();

  const paths: Record<string, any> = {};

  for (const connection of connections) {
    paths[`/llm/${connection.name}`] = {
      summary: connection.aiDescription,
    };

    for (const r of connection.tools) {
      paths[`/llm/${connection.name}/tool/${r.name}`] = {
        post: {
          parameters: r.arguments.map((arg) => ({
            name: arg.name,
            descriptin: arg.aiDescription,
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
