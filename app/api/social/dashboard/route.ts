import { NextRequest, NextResponse } from "next/server";
import { buildSocialDashboard } from "@/lib/social-dashboard";

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json();
    if (!urls || typeof urls !== "object") {
      return NextResponse.json({ error: "urls object required" }, { status: 400 });
    }

    const dashboard = await buildSocialDashboard(urls);
    return NextResponse.json(dashboard);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Dashboard build failed" },
      { status: 500 }
    );
  }
}
