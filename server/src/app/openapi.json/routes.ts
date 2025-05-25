import { listAvaliableConnections } from "@/lib/connection";
import { NextRequest, NextResponse } from "next/server";
import { Callable } from "open-api-connector-types";


export async function GET(req: NextRequest) {
  const connections = await listAvaliableConnections(__dirname);

  const paths: Record<string, any> = {};

  for (const connection of connections) {
    const registerCallables = (callables: Callable[], method: string) => {
      for (const r of callables) {
        paths[`/llm/${r.name}`] = {
          summary: r.aiDescription,
        };

        paths[`/llm/${r.name}/resource/${r.name}`] = {
          [method]: {
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
    };

    registerCallables(connection.resources, "get");
    registerCallables(connection.tools, "post");
  }

  connections[0].resources[0].name;

  return new NextResponse(
    JSON.stringify({
      openapi: "3.0.3",
      info: "",
      paths: paths,
    }),
  );
}
