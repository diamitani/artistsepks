// ── Pexels API Client ─────────────────────────────────────────────────────────
// Free stock photos for EPK hero images, backgrounds, and profile photos.

const PEXELS_API = "https://api.pexels.com/v1";

function getKey(): string {
  const key = process.env.PEXELS_API_KEY;
  if (!key) throw new Error("PEXELS_API_KEY not set");
  return key;
}

export interface PexelsPhoto {
  id: number;
  url: string;
  photographer: string;
  photographerUrl: string;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
  };
  alt: string;
}

// Search for photos
export async function searchPhotos(
  query: string,
  options?: { perPage?: number; orientation?: "landscape" | "portrait" | "square" }
): Promise<PexelsPhoto[]> {
  const params = new URLSearchParams({
    query,
    per_page: String(options?.perPage || 5),
    ...(options?.orientation ? { orientation: options.orientation } : {}),
  });

  const res = await fetch(`${PEXELS_API}/search?${params}`, {
    headers: { Authorization: getKey() },
  });

  if (!res.ok) throw new Error(`Pexels error: ${res.status}`);

  const data = await res.json();
  return data.photos || [];
}

// Get a curated/random photo by keyword
export async function getHeroImage(keyword?: string): Promise<PexelsPhoto | null> {
  const terms = keyword || "music studio concert artist";
  const photos = await searchPhotos(terms, { perPage: 1, orientation: "landscape" });
  return photos[0] || null;
}

// Multiple orientations for different template sections
export async function getProfileImage(keyword?: string): Promise<PexelsPhoto | null> {
  const terms = keyword || "musician portrait artist";
  const photos = await searchPhotos(terms, { perPage: 1, orientation: "portrait" });
  return photos[0] || null;
}
