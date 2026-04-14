import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { slugify } from "@/lib/utils";
import type { EPKData } from "@/lib/types";

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

// GET /api/epk — list current user's EPKs
export async function GET() {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("epks")
    .select("id, slug, template, data, views, downloads, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ epks: data });
}

// POST /api/epk — create a new EPK
export async function POST(request: NextRequest) {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: EPKData = await request.json();
  const baseSlug = slugify(body.artistName || "artist");

  // Ensure unique slug
  let slug = baseSlug;
  let suffix = 0;
  while (true) {
    const { data: existing } = await supabase
      .from("epks")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    suffix++;
    slug = `${baseSlug}-${suffix}`;
  }

  // Add template suffix for booking/brand
  if (body.template === "booking") slug = `${slug}-booking`;
  if (body.template === "brand") slug = `${slug}-brand`;

  const { data, error } = await supabase
    .from("epks")
    .insert({
      slug,
      user_id: user.id,
      template: body.template,
      data: body,
    })
    .select("id, slug")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, slug: data.slug }, { status: 201 });
}
