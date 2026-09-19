import { NextRequest, NextResponse } from "next/server";
import { runEPKPipeline } from "@/lib/epk-agent-pipeline";
import { generateEPKHtml } from "@/lib/export/html";
import type { ArtistProfile, EPKTemplate } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile = (body.profile || {}) as ArtistProfile;
    const template = (body.template || "main") as EPKTemplate;

    const artifacts = runEPKPipeline(profile, template);
    const epkHtml = generateEPKHtml(artifacts.epkData);

    const bundle = {
      artistName: artifacts.epkData.artistName,
      slug: artifacts.epkData.slug,
      template,
      generatedAt: new Date().toISOString(),
      files: {
        "epk.html": epkHtml,
        "master.md": artifacts.masterMd,
        "enhanced.md": artifacts.enhancedMd,
        "discography.csv": artifacts.discographyCsv,
        "discography.md": artifacts.discographyMd,
        "bio-long.md": artifacts.bioLong,
        "bio-short.md": artifacts.bioShort,
        "epk-design-system.json": JSON.stringify(artifacts.designSystemJson, null, 2),
      },
      epkData: artifacts.epkData,
    };

    return NextResponse.json({
      success: true,
      bundle,
    });
  } catch (err) {
    console.error("Export Bundle Error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Failed to generate export bundle" },
      { status: 500 }
    );
  }
}
