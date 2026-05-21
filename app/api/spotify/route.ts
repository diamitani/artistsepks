import { NextRequest, NextResponse } from "next/server";
import { fetchSpotifyData, extractSpotifyId } from "@/lib/spotify";

// GET /api/spotify?id=xxx — fetch Spotify artist data
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id parameter is required (Spotify artist ID or URL)" }, { status: 400 });
  }

  const extractedId = extractSpotifyId(id);
  if (!extractedId) {
    return NextResponse.json({ error: "Invalid Spotify artist ID or URL format" }, { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({
      error: "Spotify not configured",
      hint: "Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local",
      authUrl: "https://developer.spotify.com/dashboard",
    }, { status: 501 });
  }

  try {
    const data = await fetchSpotifyData(id);
    if (!data) {
      return NextResponse.json({ error: "Could not fetch Spotify data" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Spotify fetch failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
