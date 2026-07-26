/**
 * /api/epk/[id] — PATCH/DELETE a specific EPK
 * Auth: Cognito JWT → demo session
 */
import { NextRequest, NextResponse } from "next/server";
import type { EPKData } from "@/lib/types";
import { resolveUserId, updateEPK, deleteEPK, getDemoStore } from "@/lib/aws-db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = resolveUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: Partial<EPKData> = await req.json();

  try {
    const ok = await updateEPK(id, userId, { data: body as Record<string, unknown>, template: body.template });
    if (ok) return NextResponse.json({ success: true });
  } catch { /* DynamoDB not configured */ }

  // Demo in-memory fallback
  const { epks } = getDemoStore();
  const existing = epks.get(id);
  if (existing && existing.user_id === userId) {
    epks.set(id, { ...existing, data: body as Record<string, unknown>, template: body.template || existing.template, updated_at: new Date().toISOString() });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: true, demo: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = resolveUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await deleteEPK(id, userId);
    return NextResponse.json({ success: true });
  } catch { /* DynamoDB not configured */ }

  const { epks } = getDemoStore();
  epks.delete(id);
  return NextResponse.json({ success: true, demo: true });
}
