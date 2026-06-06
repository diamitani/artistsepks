import { NextRequest, NextResponse } from "next/server";
import type { ArtistProfile } from "@/lib/types";
import { saveProfile, loadProfile, createProfile, deleteProfile, listProfiles } from "@/lib/profile-store";

function isValidUsername(u: string): boolean {
  return /^[a-zA-Z0-9-]{3,30}$/.test(u);
}

// GET /api/profile — get by id, username, or list all
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const username = searchParams.get("username");

  if (username) {
    if (!isValidUsername(username)) {
      return NextResponse.json({ error: "Invalid username format" }, { status: 400 });
    }
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

// POST /api/profile — create or update
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, profile } = body;

  // Validate username if provided
  if (profile?.username && !isValidUsername(profile.username)) {
    return NextResponse.json({ error: "Username must be 3-30 characters: letters, numbers, and hyphens only" }, { status: 400 });
  }

  // Check username uniqueness
  if (profile?.username) {
    const all = listProfiles();
    const existing = all.find(
      (p) => p.username === profile.username && p.id !== (profile.id || p.id)
    );
    if (existing && action !== "force-update") {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
  }

  if (action === "create") {
    const newProfile = createProfile();
    return NextResponse.json({ profile: newProfile, id: newProfile.id }, { status: 201 });
  }

  // Upsert by id or username
  const profileId = profile?.id || profile?.username;
  if (!profileId) return NextResponse.json({ error: "Profile id or username required" }, { status: 400 });

  const existing = loadProfile(profileId);

  const updated: ArtistProfile = {
    ...(existing || createProfile()),
    ...profile,
    id: profileId,
    username: profile?.username || existing?.username || profileId,
    updatedAt: new Date().toISOString(),
    ...(existing ? {} : { createdAt: new Date().toISOString() }),
  };

  saveProfile(updated);
  return NextResponse.json({ profile: updated, id: updated.id });
}

// DELETE /api/profile?id=xxx
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Profile id required" }, { status: 400 });
  deleteProfile(id);
  return NextResponse.json({ success: true });
}
