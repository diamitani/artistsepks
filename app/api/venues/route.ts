import { NextRequest, NextResponse } from "next/server";
import { searchVenues, getVenue, VENUES } from "@/lib/venues";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const id = searchParams.get("id");

  if (id) {
    const venue = getVenue(id);
    if (!venue) return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    return NextResponse.json(venue);
  }

  if (q) {
    const results = searchVenues(q);
    return NextResponse.json({ venues: results });
  }

  // Return all venues grouped by type
  return NextResponse.json({
    venues: VENUES,
    total: VENUES.length,
  });
}
