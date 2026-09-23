import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isComposioConfigured } from "@/lib/composio/client";
import { listConnections } from "@/lib/composio/connect";

/**
 * GET /api/composio/status
 *
 * The signed-in artist's connected accounts (Google Drive, streaming/social
 * profile toolkits). Returns an empty list — not an error — when Composio
 * isn't configured, so the UI can just show "not connected" everywhere.
 */

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isComposioConfigured()) {
    return NextResponse.json({ connections: [], configured: false });
  }

  const connections = await listConnections(user.id);
  return NextResponse.json({ connections, configured: true });
}
