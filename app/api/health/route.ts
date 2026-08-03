/**
 * Health check endpoint — reports DB, Stripe, and AI provider status.
 * GET /api/health → { status, supabase, stripe, ai, timestamp }
 */
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { isBedrockConfigured } from "@/lib/bedrock-agent";

export async function GET() {
  const checks: Record<string, unknown> = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    supabase: await checkSupabase(),
    stripe: await checkStripe(),
    ai: checkAI(),
    env: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
      hasStripeWebhook: !!process.env.STRIPE_WEBHOOK_SECRET,
      hasAwsAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasSpotifyId: !!process.env.SPOTIFY_CLIENT_ID,
      nodeEnv: process.env.NODE_ENV || "development",
    },
  };

  // Determine overall status
  let healthy = true;
  if (checks.supabase === "error") healthy = false;
  if (checks.stripe === "error") healthy = false;
  if (checks.ai === "error") healthy = false;

  return NextResponse.json(
    { ...checks, status: healthy ? "healthy" : "degraded" },
    { status: healthy ? 200 : 503 }
  );
}

async function checkSupabase(): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes("placeholder")) {
    return "not_configured";
  }

  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(5000),
    });
    return res.ok ? "connected" : "error";
  } catch {
    return "error";
  }
}

async function checkStripe(): Promise<string> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return "not_configured";

  try {
    // Lightweight check — list 1 product
    const stripe = getStripe();
    await stripe.products.list({ limit: 1 });
    return "connected";
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("Stripe health check failed:", message);
    return "error";
  }
}

function checkAI(): string {
  const hasBedrock = isBedrockConfigured();
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasDeepseek = !!process.env.DEEPSEEK_API_KEY;

  if (hasBedrock) return "bedrock";
  if (hasAnthropic) return "anthropic";
  if (hasDeepseek) return "deepseek";
  return "not_configured";
}