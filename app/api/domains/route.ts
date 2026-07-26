/**
 * /api/domains — custom domain CRUD
 * Auth: Cognito JWT → demo session
 * Storage: DynamoDB artispreneur-domains
 */
import { NextRequest, NextResponse } from "next/server";
import { resolveUserId, listDomains, createDomain, deleteDomain, isAwsConfigured } from "@/lib/aws-db";

export async function GET(req: NextRequest) {
  const userId = resolveUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const domains = await listDomains(userId);
    return NextResponse.json({ domains });
  } catch {
    return NextResponse.json({ domains: [] });
  }
}

export async function POST(req: NextRequest) {
  const userId = resolveUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { domain, epkSlug } = await req.json();
  if (!domain || !epkSlug) {
    return NextResponse.json({ error: "domain and epkSlug required" }, { status: 400 });
  }

  try {
    const record = await createDomain({
      id: `dom_${Date.now()}`,
      user_id: userId,
      domain,
      epk_slug: epkSlug,
      verified: false,
    });
    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: "Could not register domain" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const userId = resolveUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    await deleteDomain(id, userId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not delete domain" }, { status: 500 });
  }
}
