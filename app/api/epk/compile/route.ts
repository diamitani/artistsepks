import { NextRequest, NextResponse } from "next/server";
import { runEPKPipeline, PIPELINE_STEPS } from "@/lib/epk-agent-pipeline";
import type { ArtistProfile, EPKTemplate } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile = (body.profile || {}) as ArtistProfile;
    const template = (body.template || "main") as EPKTemplate;

    // Run the full 11-step skill compilation pipeline
    const artifacts = runEPKPipeline(profile, template);

    return NextResponse.json({
      success: true,
      steps: PIPELINE_STEPS,
      artifacts,
      epkData: artifacts.epkData,
    });
  } catch (err) {
    console.error("EPK Compilation Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to compile EPK pipeline",
      },
      { status: 500 }
    );
  }
}
