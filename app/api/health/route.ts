import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const timestamp = new Date().toISOString();
  let dbStatus = "unconnected";
  let epkCount = 0;
  let profileCount = 0;

  try {
    const supabase = createAdminClient();
    const { count: epks, error: epkErr } = await supabase.from("epks").select("*", { count: "exact", head: true });
    const { count: profiles, error: profErr } = await supabase.from("profiles").select("*", { count: "exact", head: true });

    if (!epkErr && !profErr) {
      dbStatus = "connected";
      epkCount = epks ?? 0;
      profileCount = profiles ?? 0;
    } else {
      dbStatus = `error: ${epkErr?.message || profErr?.message}`;
    }
  } catch (err) {
    dbStatus = `failed: ${err instanceof Error ? err.message : String(err)}`;
  }

  return NextResponse.json({
    status: "ok",
    timestamp,
    database: {
      status: dbStatus,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "missing",
      epksTotal: epkCount,
      profilesTotal: profileCount,
    },
    platform: "ArtistEPKs by Artispreneur",
    environment: process.env.NODE_ENV,
  });
}
