/**
 * /api/auth/demo — Demo session endpoint
 *
 * GET  /api/auth/demo        — start demo session (sets cookie)
 * DELETE /api/auth/demo      — end demo session (clears cookie)
 * GET  /api/auth/demo?check  — check if demo session is active
 *
 * The demo session sets a cookie "epk-demo-session=active" which is
 * recognized by resolveUserId() in lib/aws-db.ts as demo-user-pat.
 * This lets you test the full builder/dashboard flow without Cognito.
 */
import { NextRequest, NextResponse } from "next/server";
import { DEMO_USER } from "@/lib/aws-db";

const COOKIE_NAME = "epk-demo-session";
const COOKIE_OPTS = {
  httpOnly: false, // readable by client JS so dashboard can detect it
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24, // 24 hours
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const isCheck = url.searchParams.has("check");
  const existing = req.cookies.get(COOKIE_NAME);

  if (isCheck) {
    return NextResponse.json({
      active: existing?.value === "active",
      user: existing?.value === "active" ? DEMO_USER : null,
    });
  }

  // Start demo session
  const res = NextResponse.json({
    success: true,
    user: DEMO_USER,
    message: "Demo session started. You now have full access to the builder and dashboard.",
    redirectTo: "/dashboard",
  });
  res.cookies.set(COOKIE_NAME, "active", COOKIE_OPTS);
  return res;
}

export async function DELETE(req: NextRequest) {
  const res = NextResponse.json({ success: true, message: "Demo session ended." });
  res.cookies.set(COOKIE_NAME, "", { ...COOKIE_OPTS, maxAge: 0 });
  return res;
}
