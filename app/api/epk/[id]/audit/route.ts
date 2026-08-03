/**
 * EPK Audit Endpoint — validates blueprint completeness and quality gates.
 * POST /api/epk/[id]/audit → { valid, missing, qualityScore, warnings }
 */
import { NextRequest, NextResponse } from "next/server";
import { validateBlueprint } from "@/lib/epk-blueprint";
import type { EPKData, EPKTemplate } from "@/lib/types";

const QUALITY_GATES = {
  bioMinLength: 100,
  bioMaxLength: 500,
  idealStatCount: 2,
  idealReleaseCount: 1,
  idealTimelineCount: 2,
  idealSocialCount: 1,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { epkData, template } = body as {
      epkData: EPKData;
      template: EPKTemplate;
    };

    if (!epkData || !template) {
      return NextResponse.json(
        { error: "epkData and template are required" },
        { status: 400 }
      );
    }

    const { valid, missing } = validateBlueprint(epkData, template);
    const warnings: string[] = [];
    let qualityScore = 10;

    if (!epkData.bio || epkData.bio.length < QUALITY_GATES.bioMinLength) {
      warnings.push(`Bio too short (${epkData.bio?.length || 0} chars, need >=${QUALITY_GATES.bioMinLength})`);
      qualityScore -= 2;
    }
    if (epkData.bio && /\bI\b/.test(epkData.bio.slice(0, 100))) {
      warnings.push("Bio appears to be first-person. Should be third-person for press readiness.");
      qualityScore -= 1;
    }

    const statCount = Object.values(epkData.stats || {}).filter(Boolean).length;
    if (statCount < QUALITY_GATES.idealStatCount) {
      warnings.push(`Only ${statCount} stats populated (recommend >=${QUALITY_GATES.idealStatCount})`);
      qualityScore -= 1;
    }

    if (!epkData.heroImageUrl && !epkData.profileImageUrl) {
      warnings.push("No hero or profile image set. Placeholder gradients will be used.");
      qualityScore -= 0.5;
    }

    if ((template === "main" || template === "booking") && epkData.releases.length < QUALITY_GATES.idealReleaseCount) {
      warnings.push("No releases in discography. Consider adding at least one.");
      qualityScore -= 1;
    }

    if (template !== "brand" && epkData.timeline.length < QUALITY_GATES.idealTimelineCount) {
      warnings.push(`Only ${epkData.timeline.length} timeline events (recommend >=${QUALITY_GATES.idealTimelineCount})`);
      qualityScore -= 0.5;
    }

    const socialCount = Object.values(epkData.socialLinks || {}).filter(Boolean).length;
    if (socialCount < QUALITY_GATES.idealSocialCount) {
      warnings.push("No social media links set. Consider adding at least one.");
      qualityScore -= 1;
    }

    if (!epkData.bookingEmail || !epkData.bookingEmail.includes("@")) {
      warnings.push("No valid booking email. Required for all templates.");
      qualityScore -= 2;
    }

    if (template === "booking" && (!epkData.performancePackages || epkData.performancePackages.length === 0)) {
      warnings.push("Booking template requires at least one performance package.");
      qualityScore -= 2;
    }

    if (template === "brand" && (!epkData.brandPartners || epkData.brandPartners.length === 0)) {
      warnings.push("Brand template works best with at least one brand partner or value prop.");
      qualityScore -= 1;
    }

    qualityScore = Math.max(0, Math.round(qualityScore * 10) / 10);

    return NextResponse.json({
      valid,
      missing,
      qualityScore,
      warnings,
      readyToPublish: valid && qualityScore >= 5,
      checks: {
        blueprintValid: valid,
        bioQuality: !warnings.some((w) => w.startsWith("Bio")),
        hasImages: !!(epkData.heroImageUrl || epkData.profileImageUrl),
        hasStats: statCount >= QUALITY_GATES.idealStatCount,
        hasSocial: socialCount >= QUALITY_GATES.idealSocialCount,
        hasBookingEmail: !!(epkData.bookingEmail && epkData.bookingEmail.includes("@")),
      },
    });
  } catch (err) {
    console.error("EPK audit error:", err);
    return NextResponse.json(
      { error: "Audit failed", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}