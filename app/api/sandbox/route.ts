import { NextRequest, NextResponse } from "next/server";
import { runInVercelSandbox } from "@/lib/sandbox";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, filename = "generated.mjs" } = body;

    const testCode = code || `console.log("Hello from generated code");`;

    const result = await runInVercelSandbox({
      files: [
        {
          path: `/vercel/${filename}`,
          content: testCode,
        },
      ],
      command: "node",
      args: [`/vercel/${filename}`],
      persistent: true,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Sandbox execution error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to execute in sandbox",
      },
      { status: 500 }
    );
  }
}
