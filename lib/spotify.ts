// ── Spotify API Client ─────────────────────────────────────────────────────────

const SPOTIFY_API = "https://api.spotify.com/v1";
let cachedToken: { token: string; expires: number } | null = null;

function extractSpotifyId(input: string): string | null {
  // Full URL: https://open.spotify.com/artist/24CgJHK6T7C5OmUbiLLMjJ
  const urlMatch = input.match(/open\.spotify\.com\/artist\/([a-zA-Z0-9]+)/);
  if (urlMatch) return urlMatch[1];
  // Bare ID: alphanumeric string of ~22 chars
  if (/^[a-zA-Z0-9]{15,30}$/.test(input.trim())) return input.trim();
  return null;
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set");
  }

  if (cachedToken && cachedToken.expires > Date.now()) {
    return cachedToken.token;
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`Spotify auth failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expires: Date.now() + data.expires_in * 900, // refresh at 90%
  };

  return data.access_token;
}

async function spotifyFetch<T>(path: string): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${SPOTIFY_API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 429) {
    // Rate limited — wait and retry once
    const retryAfter = Number(res.headers.get("retry-after") || "1");
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return spotifyFetch<T>(path);
  }

  if (!res.ok) {
    throw new Error(`Spotify API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ── Public API ─────────────────────────────────────────────────────────────────

export interface SpotifyArtistInfo {
  id: string;
  name: string;
  genres: string[];
  followers: number;
  popularity: number;
  imageUrl?: string;
}

export interface SpotifyAlbum {
  id: string;
  title: string;
  type: "album" | "single" | "compilation";
  releaseDate: string;
  totalTracks: number;
  coverUrl?: string;
}

export interface SpotifyTopTrack {
  id: string;
  title: string;
  popularity: number;
  durationMs: number;
  albumName: string;
  coverUrl?: string;
}

export interface SpotifyData {
  artist: SpotifyArtistInfo;
  albums: SpotifyAlbum[];
  topTracks: SpotifyTopTrack[];
}

async function fetchArtist(id: string): Promise<SpotifyArtistInfo> {
  const data: any = await spotifyFetch(`/artists/${id}`);
  return {
    id: data.id,
    name: data.name,
    genres: data.genres || [],
    followers: data.followers?.total || 0,
    popularity: data.popularity || 0,
    imageUrl: data.images?.[0]?.url,
  };
}

async function fetchAlbums(id: string): Promise<SpotifyAlbum[]> {
  const data: any = await spotifyFetch(`/artists/${id}/albums?include_groups=album,single&limit=50&market=US`);
  return (data.items || []).map((item: any) => ({
    id: item.id,
    title: item.name,
    type: item.album_group || item.album_type,
    releaseDate: item.release_date,
    totalTracks: item.total_tracks,
    coverUrl: item.images?.[0]?.url,
  }));
}

async function fetchTopTracks(id: string): Promise<SpotifyTopTrack[]> {
  const data: any = await spotifyFetch(`/artists/${id}/top-tracks?market=US`);
  return (data.tracks || []).map((item: any) => ({
    id: item.id,
    title: item.name,
    popularity: item.popularity || 0,
    durationMs: item.duration_ms || 0,
    albumName: item.album?.name || "",
    coverUrl: item.album?.images?.[0]?.url,
  }));
}

export async function fetchSpotifyData(input: string): Promise<SpotifyData | null> {
  const id = extractSpotifyId(input);
  if (!id) return null;

  const [artist, albums, topTracks] = await Promise.all([
    fetchArtist(id),
    fetchAlbums(id),
    fetchTopTracks(id),
  ]);

  return { artist, albums, topTracks };
}

export { extractSpotifyId };
