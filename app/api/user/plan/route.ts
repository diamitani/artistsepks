/**
 * /api/user/plan — GET current user's plan
 * Auth: Cognito JWT → demo session
 * Storage: DynamoDB artispreneur-plans → free fallback
 */
import { NextRequest, NextResponse } from "next/server";
import { resolveUserId, getPlan, DEMO_USER_ID } from "@/lib/aws-db";
import type { PlanId } from "@/lib/plans";

export async function GET(req: NextRequest) {
  const userId = resolveUserId(req);

  // Unauthenticated — return free plan (not 401, lets dashboard render)
  if (!userId) {
    return NextResponse.json({ plan: "free", status: "inactive" });
  }

  // Demo user always gets free plan
  if (userId === DEMO_USER_ID) {
    return NextResponse.json({ plan: "free", status: "active", demo: true });
  }

  try {
    const record = await getPlan(userId);
    if (record) {
      return NextResponse.json({
        plan: record.plan as PlanId,
        status: record.status,
        currentPeriodEnd: record.current_period_end,
      });
    }
  } catch { /* DynamoDB not configured */ }

  return NextResponse.json({ plan: "free", status: "inactive" });
}
