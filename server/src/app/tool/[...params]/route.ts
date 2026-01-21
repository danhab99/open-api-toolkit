import { executeToolCall } from "@/lib/tool";
import { constructNow } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
  const url = new URL(req.url);

  const [, , id, toolName] = url.pathname.split("/");

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "true",
  };

  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

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
        ...corsHeaders,
      },
    });
  } catch (e) {
    const err = {
      err: e,
      connectionId: id,
    };
    console.error("Tool failed to run", err);
    return new NextResponse(JSON.stringify(err), {
      status: 400,
      statusText: `tool ${id}/${toolName} threw an error`,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
}

export const POST = handler;
export const GET = handler;
export const OPTIONS = handler;
export const DELETE = handler;
