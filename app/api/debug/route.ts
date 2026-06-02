import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    aiProvider: process.env.AI_PROVIDER || "not set",
    geminiKey: process.env.GEMINI_API_KEY ? `set (${process.env.GEMINI_API_KEY.slice(0, 8)}...)` : "not set",
    anthropicKey: process.env.ANTHROPIC_DIRECT_API_KEY ? "set" : "not set",
    supabaseConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  });
}
