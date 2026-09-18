import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { PlanId } from "@/lib/plans";

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

export async function GET() {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ plan: "free", status: "inactive" });
  }

  // Find subscription linked to this user
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end, customer_email")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sub) {
    return NextResponse.json({ plan: "free", status: "inactive" });
  }

  return NextResponse.json({
    plan: sub.plan as PlanId,
    status: sub.status,
    currentPeriodEnd: sub.current_period_end,
    email: sub.customer_email,
  });
}
