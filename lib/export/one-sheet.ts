// ── One-Sheeter Generator ──────────────────────────────────────────────────────
// Creates an organized document overview of the artist profile and EPK process.

import type { ArtistProfile } from "../types";
import { buildCompositeProfile } from "../profile-builder";
import { engagementLabel } from "../engagement-scorer";

export function generateOneSheetHtml(profile: ArtistProfile): string {
  const composite = buildCompositeProfile(profile);
  const os = composite.oneSheet;
  const p = profile;
  const accent = "#C9A227";

  const filled = (v: string | number | undefined | null, label: string): string =>
    v ? `<tr><td style="padding:4px 8px;font-size:12px;color:#888;border-bottom:1px solid #222;white-space:nowrap">${label}</td><td style="padding:4px 8px;font-size:12px;color:#EDE9E0;border-bottom:1px solid #222">${v}</td></tr>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${p.background.artistName || "Artist"} — EPK One-Sheeter</title>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet"/>
  <style>
    body { margin:0; background:#050505; color:#EDE9E0; font-family:'DM Sans',system-ui,sans-serif; padding:40px; }
    h1, h2, h3 { font-family:'Bebas Neue',sans-serif; letter-spacing:0.05em; margin:0; }
    .section { margin-bottom:32px; }
    .section-title { font-size:14px; color:${accent}; text-transform:uppercase; letter-spacing:0.2em; margin-bottom:12px; border-bottom:1px solid ${accent}20; padding-bottom:6px; }
    .tag { display:inline-block; padding:3px 10px; border-radius:4px; font-size:11px; background:${accent}15; color:${accent}; border:1px solid ${accent}30; margin:2px; }
    .score-circle { display:inline-flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:50%; font-family:'Bebas Neue',sans-serif; font-size:24px; border:3px solid ${accent}; }
    table { width:100%; border-collapse:collapse; }
  </style>
</head>
<body>
  <div style="max-width:800px;margin:0 auto">

    <!-- Header -->
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:40px">
      <div style="width:60px;height:60px;border-radius:12px;background:${accent};display:flex;align-items:center;justify-content:center;font-size:28px;color:#050505;font-weight:700">♪</div>
      <div>
        <h1 style="font-size:36px;color:#EDE9E0">${p.background.artistName || "Artist Name"}</h1>
        <div style="font-size:12px;color:#888;margin-top:4px">${os.careerStage} · ${p.background.genre || "Genre"} · ${p.background.location || "Location"}</div>
      </div>
      <div style="margin-left:auto;text-align:center">
        <div class="score-circle">${composite.engagementScore.overall}</div>
        <div style="font-size:9px;color:#888;margin-top:4px;text-transform:uppercase;letter-spacing:0.1em">Engagement</div>
      </div>
    </div>

    <!-- Overview -->
    <div class="section">
      <div class="section-title">Artist Overview</div>
      <p style="font-size:14px;line-height:1.8;color:#A0A0A0">${os.artistOverview}</p>
      <div style="margin-top:8px">
        ${p.background.themes.map((t) => `<span class="tag">${t}</span>`).join("")}
        ${p.background.influences.map((i) => `<span class="tag">${i}</span>`).join("")}
      </div>
    </div>

    <!-- Brand Identity -->
    <div class="section">
      <div class="section-title">Brand Identity</div>
      <p style="font-size:14px;line-height:1.8;color:#A0A0A0">${os.brandIdentity}</p>
      ${p.background.energy ? `<div style="margin-top:8px"><span class="tag">Energy: ${p.background.energy}</span></div>` : ""}
    </div>

    <!-- Contact -->
    <div class="section">
      <div class="section-title">Contact</div>
      <table>
        ${filled(p.contact.firstName + " " + p.contact.lastName, "Name")}
        ${filled(p.contact.email, "Email")}
        ${filled(p.contact.phone, "Phone")}
        ${filled(p.contact.website, "Website")}
        ${filled(p.contact.managerName, "Manager")}
        ${filled(p.contact.label, "Label")}
      </table>
    </div>

    <!-- Goals -->
    <div class="section">
      <div class="section-title">Goals &amp; Timeline</div>
      <table>
        ${filled(p.goals.primaryGoal, "Primary Goal")}
        ${filled(p.goals.performanceFrequency, "Performance Goal")}
        ${filled(p.goals.streamingTarget, "Streaming Target")}
        ${filled(p.goals.revenueTarget, "Revenue Target")}
        ${filled(p.goals.timeline, "Timeline")}
      </table>
      ${p.goals.smartGoals.length ? `<div style="margin-top:8px"><div style="font-size:11px;color:#888;margin-bottom:4px">SMART Goals</div>${p.goals.smartGoals.map((g) => `<div style="font-size:13px;color:#A0A0A0;margin-bottom:4px;padding-left:12px;border-left:2px solid ${accent}40">${g}</div>`).join("")}</div>` : ""}
    </div>

    <!-- Stats -->
    <div class="section">
      <div class="section-title">Audience &amp; Reach</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px">
        ${Object.entries(composite.stats).filter(([, v]) => v).map(([k, v]) => `
          <div style="background:#0D0D0D;border-radius:8px;padding:16px;text-align:center;border:1px solid ${accent}20">
            <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:${accent}">${v}</div>
            <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:0.1em;margin-top:4px">${k.replace(/([A-Z])/g, " $1").trim()}</div>
          </div>
        `).join("")}
      </div>
      ${composite.engagementScore.instagram || composite.engagementScore.tiktok || composite.engagementScore.youtube ? `
        <div style="margin-top:16px">
          <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px">Engagement Rate by Platform</div>
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            ${composite.engagementScore.instagram ? `<div style="font-size:12px;color:#A0A0A0">Instagram: <span style="color:${accent}">${composite.engagementScore.instagram.rate}%</span></div>` : ""}
            ${composite.engagementScore.tiktok ? `<div style="font-size:12px;color:#A0A0A0">TikTok: <span style="color:${accent}">${composite.engagementScore.tiktok.rate}%</span></div>` : ""}
            ${composite.engagementScore.youtube ? `<div style="font-size:12px;color:#A0A0A0">YouTube: <span style="color:${accent}">${composite.engagementScore.youtube.rate}%</span></div>` : ""}
          </div>
        </div>` : ""}
    </div>

    <!-- Business Readiness -->
    <div class="section">
      <div class="section-title">Business Readiness</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
        ${p.assets.hasPro ? `<div style="color:#27C93F">✅ PRO: ${p.assets.proOrganization || "Registered"}</div>` : "<div style='color:#555'>❌ Not registered with a PRO</div>"}
        ${p.assets.hasCopyrights ? "<div style='color:#27C93F'>✅ Copyrights registered</div>" : "<div style='color:#555'>❌ No copyrights</div>"}
        ${p.assets.hasSplitSheets ? "<div style='color:#27C93F'>✅ Split sheets in place</div>" : "<div style='color:#555'>❌ No split sheets</div>"}
        ${p.assets.hasContracts ? "<div style='color:#27C93F'>✅ Contracts in place</div>" : "<div style='color:#555'>❌ No contracts</div>"}
        ${p.assets.businessEntity && p.assets.businessEntity !== "none" ? `<div style='color:#27C93F'>✅ ${p.assets.businessEntity.toUpperCase()}</div>` : "<div style='color:#555'>❌ No business entity</div>"}
        ${p.assets.hasEin ? "<div style='color:#27C93F'>✅ EIN obtained</div>" : "<div style='color:#555'>❌ No EIN</div>"}
        ${p.assets.hasBankAccount ? "<div style='color:#27C93F'>✅ Business bank account</div>" : "<div style='color:#555'>❌ No business bank account</div>"}
      </div>
      ${p.assets.needsHelp.length ? `<div style="margin-top:12px"><div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.1em">Needs Help With</div><div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">${p.assets.needsHelp.map((h) => `<span class="tag">${h}</span>`).join("")}</div></div>` : ""}
    </div>

    <!-- Discography -->
    ${composite.discography.length ? `
    <div class="section">
      <div class="section-title">Discography</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px">
        ${composite.discography.map((r) => `
          <div style="background:#0D0D0D;border-radius:6px;padding:10px 14px;border:1px solid #222">
            <div style="font-weight:600;font-size:13px;color:#EDE9E0">${r.title}</div>
            <div style="font-size:11px;color:#888">${r.type} · ${r.year}${r.tracks ? ` · ${r.tracks} tracks` : ""}</div>
          </div>
        `).join("")}
      </div>
    </div>` : ""}

    <!-- Recommended Next Steps -->
    <div class="section">
      <div class="section-title">Recommended Next Steps</div>
      <ol style="font-size:14px;color:#A0A0A0;line-height:2">
        ${os.recommendedNext.map((s) => `<li>${s}</li>`).join("")}
      </ol>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid ${accent}20;padding-top:16px;margin-top:32px;text-align:center;font-size:11px;color:#555">
      Generated by EPK Agent · ${new Date().toLocaleDateString()} · Engagement Grade: ${os.engagementGrade}
    </div>

  </div>
</body>
</html>`;
}
