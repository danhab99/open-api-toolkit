import { executeToolCall } from "@/lib/tool";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);

  const [, , id, toolName] = url.pathname.split("/");

  try {
    const results = await executeToolCall(
      parseInt(id),
      toolName,
      url.searchParams,
    );
    return new NextResponse(JSON.stringify(results), {
      status: 200,
      statusText: `tool ${id}/${toolName} ran successfully`,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    return new NextResponse(
      JSON.stringify({
        err: e,
        connectionId: id,
      }),
      {
        status: 400,
        statusText: `tool ${id}/${toolName} threw an error`,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
