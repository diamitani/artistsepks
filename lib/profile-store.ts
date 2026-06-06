// ── Artist Profile Storage ─────────────────────────────────────────────────────
// Local JSON-file backed storage with Supabase migration path.
// When NEXT_PUBLIC_SUPABASE_URL is configured, switches to Supabase.

import fs from "fs";
import path from "path";
import type { ArtistProfile } from "./types";
import { EMPTY_PROFILE } from "./types";

const PROFILES_DIR = path.join(process.cwd(), ".profiles");

function ensureDir() {
  if (!fs.existsSync(PROFILES_DIR)) {
    fs.mkdirSync(PROFILES_DIR, { recursive: true });
  }
}

function filePath(id: string): string {
  return path.join(PROFILES_DIR, `${id}.json`);
}

// ── Local file-based storage ───────────────────────────────────────────────────

function localSave(profile: ArtistProfile): void {
  try {
    ensureDir();
    fs.writeFileSync(filePath(profile.id), JSON.stringify(profile, null, 2), "utf-8");
  } catch {
    // read-only filesystem (Vercel serverless) — Supabase sync handles persistence
  }
}

function localLoad(id: string): ArtistProfile | null {
  try {
    const fp = filePath(id);
    if (!fs.existsSync(fp)) return null;
    return JSON.parse(fs.readFileSync(fp, "utf-8")) as ArtistProfile;
  } catch {
    return null;
  }
}

function localDelete(id: string): void {
  const fp = filePath(id);
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
}

function localList(): ArtistProfile[] {
  try {
    ensureDir();
    return fs.readdirSync(PROFILES_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        try {
          return JSON.parse(fs.readFileSync(path.join(PROFILES_DIR, f), "utf-8")) as ArtistProfile;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as ArtistProfile[];
  } catch {
    return []; // read-only filesystem (Vercel serverless)
  }
}

// ── Supabase storage (when configured) ─────────────────────────────────────────

async function supabaseSave(profile: ArtistProfile): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
    return localSave(profile); // fallback to local
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
      method: "UPSERT",
      headers: {
        apikey: supabaseKey!,
        Authorization: `Bearer ${supabaseKey!}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        id: profile.userId || profile.id,
        profile_data: profile,
        updated_at: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error(`Supabase save failed: ${res.status}`);
  } catch {
    // Fallback to local
    localSave(profile);
  }
}

async function supabaseLoad(id: string): Promise<ArtistProfile | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
    return localLoad(id);
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(id)}&select=profile_data`,
      {
        headers: { apikey: supabaseKey!, Authorization: `Bearer ${supabaseKey!}` },
      }
    );
    if (!res.ok) throw new Error(`Supabase load failed: ${res.status}`);
    const rows = await res.json();
    if (rows?.length > 0) return rows[0].profile_data as ArtistProfile;
    return null;
  } catch {
    return localLoad(id);
  }
}

// ── ID generation ──────────────────────────────────────────────────────────────

export function generateProfileId(): string {
  return `prof_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── Public API ─────────────────────────────────────────────────────────────────

export function saveProfile(profile: ArtistProfile): void {
  localSave(profile);
  // Fire-and-forget Supabase sync
  supabaseSave(profile).catch(() => {});
}

export function loadProfile(id: string): ArtistProfile | null {
  return localLoad(id);
}

export async function loadProfileAsync(id: string): Promise<ArtistProfile | null> {
  return supabaseLoad(id);
}

export function deleteProfile(id: string): void {
  localDelete(id);
}

export function listProfiles(): ArtistProfile[] {
  return localList();
}

export function createProfile(): ArtistProfile {
  const profile: ArtistProfile = {
    ...EMPTY_PROFILE,
    id: generateProfileId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveProfile(profile);
  return profile;
}

export function updateProfile(id: string, updates: Partial<ArtistProfile>): ArtistProfile | null {
  const profile = loadProfile(id);
  if (!profile) return null;
  const updated = { ...profile, ...updates, updatedAt: new Date().toISOString() };
  saveProfile(updated);
  return updated;
}
