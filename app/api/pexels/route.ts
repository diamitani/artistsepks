import { NextRequest, NextResponse } from "next/server";
import { searchPhotos, getHeroImage } from "@/lib/pexels";

// GET /api/pexels?q=concert&orientation=landscape
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const orientation = searchParams.get("orientation") as "landscape" | "portrait" | "square" | null;
  const type = searchParams.get("type"); // "hero" or "profile"

  if (!q && !type) {
    return NextResponse.json({ error: "Provide q (search query) or type (hero/profile)" }, { status: 400 });
  }

  if (!process.env.PEXELS_API_KEY) {
    return NextResponse.json({ error: "PEXELS_API_KEY not configured" }, { status: 501 });
  }

  try {
    if (type === "hero") {
      const photo = await getHeroImage(q || undefined);
      return NextResponse.json(photo || { error: "No images found" });
    }

    const photos = await searchPhotos(q || "music", { orientation: orientation || undefined });
    return NextResponse.json({ photos });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Pexels request failed" },
      { status: 500 }
    );
  }
}
