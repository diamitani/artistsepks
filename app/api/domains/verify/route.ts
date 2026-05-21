import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import * as dns from "dns/promises";

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder",
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          ),
      },
    }
  );
}

// POST /api/domains/verify — check DNS propagation for a domain
export async function POST(request: NextRequest) {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "domain id is required" }, { status: 400 });
  }

  // Fetch the domain entry
  const { data: entry, error: fetchError } = await supabase
    .from("domains")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !entry) {
    return NextResponse.json({ error: "Domain not found" }, { status: 404 });
  }

  // Verify DNS: check CNAME record points to artistsepks.com
  let verified = false;
  try {
    const cnameRecords = await dns.resolveCname(entry.domain);
    if (
      cnameRecords.some(
        (r) =>
          r === "artistsepks.com" ||
          r === "artistsepks.com." ||
          r.endsWith(".artistsepks.com")
      )
    ) {
      verified = true;
    }
  } catch {
    // DNS lookup failed — domain isn't configured yet
  }

  // Also check the www subdomain
  if (!verified) {
    try {
      const wwwRecords = await dns.resolveCname(`www.${entry.domain}`);
      if (
        wwwRecords.some(
          (r) =>
            r === "artistsepks.com" ||
            r === "artistsepks.com." ||
            r.endsWith(".artistsepks.com")
        )
      ) {
        verified = true;
      }
    } catch {
      // No www CNAME
    }
  }

  // Update the verification status
  const { data: updated, error: updateError } = await supabase
    .from("domains")
    .update({ verified, verified_at: verified ? new Date().toISOString() : null })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ domain: updated, verified });
}
