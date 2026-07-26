/**
 * /api/epk — EPK CRUD
 * Auth: Cognito JWT (preferred) → Supabase session fallback
 * Storage: Supabase epks table (if configured) → DynamoDB fallback
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { slugify } from "@/lib/utils";
import type { EPKData } from "@/lib/types";

// ── Supabase helper (null-safe) ───────────────────────────────────────────────
async function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || url.includes("placeholder") || !key || key === "placeholder") return null;

  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) =>
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        ),
    },
  });
}

// ── Cognito JWT verification (lightweight — checks Authorization header) ──────
async function getCognitoUserId(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  try {
    // Decode JWT payload (no verification for now — trust Cognito-issued tokens)
    // In production, verify signature against Cognito JWKS
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    return payload.sub || null;
  } catch {
    return null;
  }
}

// ── DynamoDB fallback storage ─────────────────────────────────────────────────
async function getDynamo() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) return null;

  const { DynamoDBClient } = await import("@aws-sdk/client-dynamodb");
  const { DynamoDBDocumentClient } = await import("@aws-sdk/lib-dynamodb");

  const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: { accessKeyId, secretAccessKey },
  });
  return DynamoDBDocumentClient.from(client);
}

const EPK_TABLE = process.env.EPK_DYNAMO_TABLE || "artispreneur-epks";

// ── GET /api/epk — list user's EPKs ──────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Try Cognito auth first
  let userId = await getCognitoUserId(req);

  // Try Supabase auth
  const supabase = await getSupabase();
  if (!userId && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id || null;
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Try Supabase first
  if (supabase) {
    const { data, error } = await supabase
      .from("epks")
      .select("id, slug, template, data, views, downloads, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (!error) return NextResponse.json({ epks: data || [] });
  }

  // DynamoDB fallback
  const dynamo = await getDynamo();
  if (dynamo) {
    const { QueryCommand } = await import("@aws-sdk/lib-dynamodb");
    const result = await dynamo.send(new QueryCommand({
      TableName: EPK_TABLE,
      IndexName: "user_id-updated_at-index",
      KeyConditionExpression: "user_id = :uid",
      ExpressionAttributeValues: { ":uid": userId },
      ScanIndexForward: false,
    }));
    return NextResponse.json({ epks: result.Items || [] });
  }

  // Neither configured — return empty (demo mode)
  return NextResponse.json({ epks: [] });
}

// ── POST /api/epk — create EPK ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let userId = await getCognitoUserId(req);

  const supabase = await getSupabase();
  if (!userId && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id || null;
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Plan gate (Supabase only — skip if not configured)
  if (supabase) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const plan = (sub?.plan as string) || "free";
    const planActive = sub?.status === "active" || sub?.status === "complete";

    const { count } = await supabase
      .from("epks")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    const epkCount = count ?? 0;

    if (plan === "free" && epkCount >= 1) {
      return NextResponse.json({ error: "Free limit reached (1 EPK). Upgrade to create more." }, { status: 402 });
    }
    if (plan !== "free" && !planActive) {
      return NextResponse.json({ error: "Your purchase is not active." }, { status: 402 });
    }
  }

  const body = await req.json() as EPKData;
  const { template = "main", artistName } = body;
  if (!artistName) return NextResponse.json({ error: "artistName required" }, { status: 400 });

  const baseSlug = slugify(artistName);
  const suffix = template === "booking" ? "-booking" : template === "brand" ? "-brand" : "";
  const slug = `${baseSlug}${suffix}-${Date.now().toString(36)}`;
  const now = new Date().toISOString();

  // Store in Supabase if configured
  if (supabase) {
    const { data, error } = await supabase
      .from("epks")
      .insert({ slug, user_id: userId, template, data: body, views: 0, downloads: 0 })
      .select("id, slug")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ id: data.id, slug: data.slug });
  }

  // DynamoDB fallback
  const dynamo = await getDynamo();
  if (dynamo) {
    const { PutCommand } = await import("@aws-sdk/lib-dynamodb");
    const id = `epk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await dynamo.send(new PutCommand({
      TableName: EPK_TABLE,
      Item: { id, slug, user_id: userId, template, data: body, views: 0, downloads: 0, created_at: now, updated_at: now },
    }));
    return NextResponse.json({ id, slug });
  }

  // Demo mode — return a preview slug
  return NextResponse.json({ id: `demo_${Date.now()}`, slug, demo: true });
}
