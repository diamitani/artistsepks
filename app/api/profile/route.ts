import { NextRequest, NextResponse } from "next/server";
import type { ArtistProfile } from "@/lib/types";
import { saveProfile, loadProfile, loadProfileAsync, createProfile, deleteProfile, listProfiles, updateProfile } from "@/lib/profile-store";

// GET /api/profile — list all / get by id
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

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

  if (action === "create") {
    const newProfile = createProfile();
    return NextResponse.json({ profile: newProfile, id: newProfile.id }, { status: 201 });
  }

  if (action === "update" || (profile && profile.id)) {
    if (!profile.id) return NextResponse.json({ error: "Profile id required" }, { status: 400 });
    const existing = loadProfile(profile.id);
    if (!existing) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const updated = {
      ...existing,
      ...profile,
      updatedAt: new Date().toISOString(),
    };

    saveProfile(updated as ArtistProfile);
    return NextResponse.json({ profile: updated });
  }

  // Direct create with full profile data
  const newProfile: ArtistProfile = {
    ...profile,
    id: profile.id || `prof_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveProfile(newProfile);
  return NextResponse.json({ profile: newProfile, id: newProfile.id }, { status: 201 });
}

// DELETE /api/profile?id=xxx
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Profile id required" }, { status: 400 });

  deleteProfile(id);
  return NextResponse.json({ success: true });
}
