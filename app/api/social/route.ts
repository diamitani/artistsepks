import { NextRequest, NextResponse } from "next/server";
import { scrapeSocialProfile, detectPlatform } from "@/lib/social-scraper";

// GET /api/social?url=https://instagram.com/username
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url parameter is required (e.g. https://instagram.com/username)" }, { status: 400 });
  }

  const platform = detectPlatform(url);
  if (platform === "unknown") {
    return NextResponse.json({
      error: "Unsupported platform",
      supported: ["instagram.com", "tiktok.com", "youtube.com", "twitter.com", "x.com"],
    }, { status: 400 });
  }

  try {
    const data = await scrapeSocialProfile(url);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Scrape failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
