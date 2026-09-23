import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/composio/callback
 *
 * Composio's own connect flow completes the OAuth handshake itself; this
 * route only needs to exist as a landing page to send the artist back into
 * the app afterward. The actual connection state is confirmed by polling
 * GET /api/composio/status, not by anything in this callback's query string.
 */

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const destination = new URL("/dashboard/profile", url.origin);
  destination.searchParams.set("connected", "1");
  return NextResponse.redirect(destination);
}
