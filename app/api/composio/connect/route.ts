import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isComposioConfigured } from "@/lib/composio/client";
import { startConnection, TOOLKITS, type ToolkitKey } from "@/lib/composio/connect";

/**
 * POST /api/composio/connect
 * Body: { toolkit: "googleDrive" | "spotify" | "instagram" | "tiktok" | "youtube" }
 *
 * Starts a Composio-managed OAuth connection and returns the URL to send the
 * signed-in artist to. They complete auth on Composio's/the provider's own
 * page, then land back on /api/composio/callback.
 */

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isComposioConfigured()) {
    return NextResponse.json(
      { error: "Composio isn't configured on this deployment. Add COMPOSIO_API_KEY to enable connections." },
      { status: 503 }
    );
  }

  let body: { toolkit?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const toolkit = body.toolkit as ToolkitKey | undefined;
  if (!toolkit || !(toolkit in TOOLKITS)) {
    return NextResponse.json(
      { error: `"toolkit" must be one of: ${Object.keys(TOOLKITS).join(", ")}` },
      { status: 400 }
    );
  }

  const result = await startConnection(user.id, toolkit);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json(result);
}
