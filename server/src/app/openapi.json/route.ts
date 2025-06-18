"use server";
import { getMyConnections, getTools, getAllConnections } from "@/lib/connection";
import { NextResponse } from "next/server";

export async function GET() {
  const connections = await getMyConnections();

  const paths: Record<string, any> = {
    components: {
      responses: {
        ToolFinished: {
          description: "Success - tool finished successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
              },
            },
          },
        },
        ToolDidntWorkError: {
          description: "Bad Request - tool didn't work",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "tool didn't work",
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  for (const connection of connections) {
    if (!connection.enabled) {
      continue;
    }

    paths[`/tool/${connection.name}`] = {
      summary: connection.aiDescription,
    };

    const tools = await getTools(connection.def.id);

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
        responses: {
          "200": {
            $ref: "#/components/responses/ToolFinished",
          },
          "400": {
            $ref: "#/components/responses/ToolDidntWorkError",
          },
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
