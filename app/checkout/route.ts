import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession, isValidPlan } from "@/lib/stripe-checkout";

// GET /checkout?plan=epk_style_pro — the pricing page links here.
// Sends signed-out visitors to sign up first, then straight to Stripe.
export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get("plan");
  const origin = req.nextUrl.origin;

  if (!isValidPlan(plan)) {
    return NextResponse.redirect(`${origin}/pricing`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const back = encodeURIComponent(`/checkout?plan=${plan}`);
    return NextResponse.redirect(`${origin}/auth/signup?redirectTo=${back}`);
  }

  try {
    const session = await createCheckoutSession({
      plan,
      origin,
      userId: user.id,
      email: user.email,
    });
    return NextResponse.redirect(session.url ?? `${origin}/pricing`, 303);
  } catch (err) {
    console.error("Stripe checkout error:", err instanceof Error ? err.message : err);
    return NextResponse.redirect(`${origin}/pricing?error=checkout_failed`);
  }
}
