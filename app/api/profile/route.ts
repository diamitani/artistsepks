import { NextRequest, NextResponse } from "next/server";
import type { ArtistProfile } from "@/lib/types";
import { saveProfile, loadProfile, createProfile, deleteProfile, listProfiles } from "@/lib/profile-store";

// ── Supabase helpers (for serverless environments) ────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const useSupabase = SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes("placeholder");

async function supabaseQuery(path: string, options?: RequestInit) {
  if (!useSupabase) return null;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SERVICE_KEY || SUPABASE_KEY!,
      Authorization: `Bearer ${SERVICE_KEY || SUPABASE_KEY!}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) return null;
  return res.json();
}

// ── Validation ────────────────────────────────────────────────────────────────

function isValidUsername(u: string): boolean {
  return /^[a-zA-Z0-9-]{3,30}$/.test(u);
}

// ── Handlers ──────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const username = searchParams.get("username");

  if (username) {
    if (!isValidUsername(username)) return NextResponse.json({ error: "Invalid username" }, { status: 400 });

    // Try Supabase first
    if (useSupabase) {
      const data = await supabaseQuery(
        `profiles?profile_data->>username=eq.${encodeURIComponent(username)}&select=profile_data`
      );
      if (data?.[0]?.profile_data) {
        return NextResponse.json(data[0].profile_data);
      }
    }

    // Fallback to local
    const all = listProfiles();
    const match = all.find((p) => p.username === username || p.id === username);
    if (!match) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    return NextResponse.json(match);
  }

  if (id) {
    const profile = loadProfile(id);
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    return NextResponse.json(profile);
  }

  return NextResponse.json({ profiles: listProfiles() });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, profile } = body;

  if (profile?.username && !isValidUsername(profile.username)) {
    return NextResponse.json({ error: "Username: 3-30 chars, letters/numbers/hyphens only" }, { status: 400 });
  }

  // Check username uniqueness via Supabase
  if (profile?.username && useSupabase) {
    const existing = await supabaseQuery(
      `profiles?profile_data->>username=eq.${encodeURIComponent(profile.username)}&select=id`
    );
    if (existing?.length > 0 && existing[0].id !== profile.id) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
  }

  if (action === "create") {
    const newProfile = createProfile();
    return NextResponse.json({ profile: newProfile, id: newProfile.id }, { status: 201 });
  }

  const profileId = profile?.id || profile?.username;
  if (!profileId) return NextResponse.json({ error: "Profile id or username required" }, { status: 400 });

  const existing = useSupabase
    ? null // Don't load locally if using Supabase
    : loadProfile(profileId);

  const updated: ArtistProfile = {
    ...(existing || createProfile()),
    ...profile,
    id: profileId,
    username: profile?.username || existing?.username || profileId,
    updatedAt: new Date().toISOString(),
    ...(existing ? {} : { createdAt: new Date().toISOString() }),
  };

  saveProfile(updated);

  // Also save to Supabase directly
  if (useSupabase) {
    const payload = {
      id: profileId,
      profile_data: updated,
      updated_at: new Date().toISOString(),
    };
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(profileId)}`, {
        method: "PUT",
        headers: {
          apikey: SERVICE_KEY || SUPABASE_KEY!,
          Authorization: `Bearer ${SERVICE_KEY || SUPABASE_KEY!}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify(payload),
      });
    } catch { /* local save is the fallback */ }
  }

  return NextResponse.json({ profile: updated, id: updated.id });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Profile id required" }, { status: 400 });

  if (useSupabase) {
    await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY!, Authorization: `Bearer ${SUPABASE_KEY!}` },
    }).catch(() => {});
  }

  deleteProfile(id);
  return NextResponse.json({ success: true });
}
