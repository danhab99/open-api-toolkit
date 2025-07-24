"use server";
import {
  getMyConnections,
  getTools,
  getAllConnections,
} from "@/lib/connection";
import { NextResponse } from "next/server";

const components = {
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
};

export async function GET() {
  const connections = await getMyConnections();

  const paths: Record<string, any> = {};

  for (const connection of connections) {
    if (!connection.enabled) {
      continue;
    }

    paths[`/tool/${connection.id}`] = {
      summary: connection.aiDescription,
    };

    const tools = await getTools(connection.def.id);

    for (const r of tools) {
      paths[`/tool/${connection.id}/${r.name}`] = {
        post: {
          operationId: r.name,
          parameters: r.arguments.map((arg) => ({
            name: arg.name,
            description: arg.aiDescription,
            in: "query",
            schema: {
              type: arg.type,
            },
          })),
          summary: r.aiDescription,
          responses: {
            "200": {
              $ref: "#/components/responses/ToolFinished",
            },
            "400": {
              $ref: "#/components/responses/ToolDidntWorkError",
            },
          },
        },
      };
    }
  }

  console.log("Sending openapi.json manifest");
  return new NextResponse(
    JSON.stringify({
      openapi: "3.0.3",
      info: {
        title: "OpenAPI Toolkit",
        version: "1.0.0",
      },
      "x-openai-is-compatible": true,
      paths,
      components,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // or specific origin
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
