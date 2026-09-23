import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isComposioConfigured } from "@/lib/composio/client";
import { findDriveFiles, importFromDrive, saveToDrive } from "@/lib/composio/drive";

/**
 * POST /api/composio/drive
 *
 * One endpoint, three actions, all scoped to the signed-in artist's own
 * connected Drive account:
 *
 *   { action: "save",   name, mimeType, base64Content, folderId? }  → upload an EPK export
 *   { action: "find",   query? }                                    → list/search Drive files
 *   { action: "import", fileId }                                    → pull a file's content in
 */

type Body =
  | { action: "save"; name: string; mimeType: string; base64Content: string; folderId?: string }
  | { action: "find"; query?: string }
  | { action: "import"; fileId: string };

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
      { error: "Composio isn't configured on this deployment. Add COMPOSIO_API_KEY to enable Drive." },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (body.action === "save") {
    if (!body.name || !body.mimeType || !body.base64Content) {
      return NextResponse.json({ error: "Provide name, mimeType and base64Content." }, { status: 400 });
    }
    const result = await saveToDrive(user.id, body);
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  }

  if (body.action === "find") {
    const result = await findDriveFiles(user.id, body.query);
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  }

  if (body.action === "import") {
    if (!body.fileId) {
      return NextResponse.json({ error: "Provide fileId." }, { status: 400 });
    }
    const result = await importFromDrive(user.id, body.fileId);
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  }

  return NextResponse.json({ error: `Unknown action "${(body as { action?: string }).action}".` }, { status: 400 });
}
