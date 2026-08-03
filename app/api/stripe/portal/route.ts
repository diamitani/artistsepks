import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getStripe } from "@/lib/stripe";

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

export async function POST(req: NextRequest) {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find stripe customer ID for this user — try user_id first, then email
  let customerId: string | null = null;

  const { data: subById } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subById?.stripe_customer_id) {
    customerId = subById.stripe_customer_id;
  } else {
    // Fallback: find by email
    const { data: subByEmail } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("customer_email", user.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subByEmail?.stripe_customer_id) {
      customerId = subByEmail.stripe_customer_id;

      // Backfill user_id linkage
      await supabase
        .from("subscriptions")
        .update({ user_id: user.id })
        .eq("customer_email", user.email);
    }
  }

  if (!customerId) {
    return NextResponse.json(
      { error: "No billing account found. If you recently purchased, please allow a moment for processing." },
      { status: 404 }
    );
  }

  try {
    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.nextUrl.origin}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("Stripe portal error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}