import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { getStripe, WEBHOOK_SECRET } from "@/lib/stripe";

// Admin Supabase client for webhook operations (bypasses RLS)
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;
function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && key) {
      _supabaseAdmin = createClient(url, key);
    }
  }
  return _supabaseAdmin;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // One-time payment completed (primary flow — per-EPK pricing)
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }
      // Payment intent succeeded (redundant safety net)
      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(intent);
        break;
      }
      // Future: subscription events for recurring plans
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const customerEmail =
    session.customer_email ?? session.customer_details?.email;
  const customerId =
    (session.customer as string) || session.id; // fallback to session.id
  const plan =
    session.metadata?.plan || "epk_edit";
  // Extract user_id from metadata (set by checkout route)
  const userId = session.metadata?.user_id || null;

  if (!customerEmail) {
    console.warn("No email in checkout session", session.id);
    return;
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    console.warn("Supabase admin not configured — skipping subscription save");
    return;
  }

  const { data: existing } = await admin
    .from("subscriptions")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  const record = {
    plan,
    status: "complete",
    stripe_customer_id: customerId,
    customer_email: customerEmail,
    ...(userId ? { user_id: userId } : {}),
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    await admin
      .from("subscriptions")
      .update(record)
      .eq("id", existing.id);
  } else {
    await admin.from("subscriptions").insert({
      ...record,
      metadata: { session_id: session.id },
      created_at: new Date().toISOString(),
    });
  }
}

async function handlePaymentIntentSucceeded(intent: Stripe.PaymentIntent) {
  // Redundant with checkout.session.completed for one-time payments.
  // Used as a safety net — if checkout.session.completed fails,
  // this ensures the subscription record exists.
  const plan = intent.metadata?.plan || "epk_edit";
  const userId = intent.metadata?.user_id || null;

  if (!userId) return; // Can't link without user_id

  const admin = getSupabaseAdmin();
  if (!admin) return;

  const { data: existing } = await admin
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .eq("plan", plan)
    .maybeSingle();

  if (existing) return; // Already processed

  await admin.from("subscriptions").insert({
    plan,
    status: "complete",
    stripe_customer_id: intent.customer as string,
    customer_email: "",
    user_id: userId,
    metadata: { payment_intent_id: intent.id },
    created_at: new Date().toISOString(),
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;
  const plan = subscription.metadata?.plan || "epk_edit";

  const admin = getSupabaseAdmin();
  if (!admin) return;

  await admin
    .from("subscriptions")
    .update({
      status,
      plan,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const admin = getSupabaseAdmin();
  if (!admin) return;

  await admin
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId);
}