import { NextRequest, NextResponse } from "next/server";

export interface PersonaEvaluation {
  id: string;
  persona: string;
  role: string;
  avatarIcon: string;
  score: number; // 0-100
  verdict: "Sign Immediately" | "High Booking Potential" | "Press Ready" | "High Growth Asset" | "Needs Polish" | "Missing Critical Assets" | "Developing Talent";
  summary: string;
  strengths: string[];
  missingElements: string[];
  actionPlan: string;
}

export interface AnalysisResponse {
  overallScore: number;
  readinessTier: "A&R Priority" | "Festival Ready" | "Developing Talent" | "Draft Stage";
  summary: string;
  personas: PersonaEvaluation[];
  topRecommendations: string[];
  suggestedTemplate: "main" | "booking" | "brand";
  generatedBioHook?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { artistName, genre, bio, spotifyUrl, monthlyListeners, hasPhotos, hasRider, hasPress } = body;

    const listenersNum = parseInt(String(monthlyListeners || "0").replace(/[^0-9]/g, ""), 10) || 0;
    const bioLength = (bio || "").trim().length;

    // Calculate score points
    let baseScore = 50;
    if (artistName) baseScore += 8;
    if (genre) baseScore += 5;
    if (bioLength > 100) baseScore += 12;
    if (listenersNum > 5000) baseScore += 8;
    if (listenersNum > 50000) baseScore += 7;
    if (hasPhotos) baseScore += 5;
    if (hasRider) baseScore += 5;
    if (hasPress) baseScore += 5;

    const overallScore = Math.min(Math.max(baseScore, 35), 98);

    const personas: PersonaEvaluation[] = [
      {
        id: "major_exec",
        persona: "Major Label A&R President",
        role: "Columbia / Interscope / Atlantic A&R Perspective",
        avatarIcon: "Disc3",
        score: listenersNum > 50000 ? 92 : listenersNum > 10000 ? 78 : 64,
        verdict: listenersNum > 50000 ? "Sign Immediately" : "Developing Talent",
        summary: `Evaluating ${artistName || "the artist"} for sonic commercial viability and streaming consistency. The ${genre || "genre"} positioning shows promise, but streaming velocity and demographic data needs direct proof.`,
        strengths: [
          `Distinct genre positioning in ${genre || "Modern Music"}`,
          bioLength > 80 ? "Clear artist narrative and sound identity" : "Concise profile snapshot",
        ],
        missingElements: [
          listenersNum < 25000 ? "Needs 30-day streaming growth trajectory proof" : "Requires RIAA or chart placement callout",
          "One-sheet downloadable executive summary",
        ],
        actionPlan: "Highlight top streaming track, playlist placements (e.g., RapCaviar, New Music Friday), and month-over-month listener growth.",
      },
      {
        id: "indie_label",
        persona: "Indie Label Owner & Imprint CEO",
        role: "Boutique Label & Sync Licensing Executive",
        avatarIcon: "Building",
        score: Math.min(overallScore + 4, 95),
        verdict: "High Growth Asset",
        summary: `Focusing on catalog equity, release campaign momentum, and sync licensing clearance. We need to know if master and publishing rights are 100% one-stop.`,
        strengths: [
          "Direct-to-fan appeal with strong potential for vinyl/merch bundles",
          "Organic storytelling that connects with tastemaker blogs",
        ],
        missingElements: [
          "Sync metadata tags (BPM, Key, Mood, Instrumental Stems)",
          "Split sheet confirmation or PRO registration badge (BMI/ASCAP/SESAC)",
        ],
        actionPlan: "Add a Sync & Licensing reel section with one-stop clearance badges and high-res album art.",
      },
      {
        id: "manager_booking",
        persona: "Artist Manager & Festival Talent Buyer",
        role: "UTA / CAA / Live Nation Booking Perspective",
        avatarIcon: "Calendar",
        score: hasRider ? 88 : 62,
        verdict: hasRider ? "High Booking Potential" : "Needs Polish",
        summary: `Promoters and festival talent buyers need stage plot specs, live setup requirements, and past venue sellouts before confirming guarantee fees.`,
        strengths: [
          "Clear contact routing for booking inquiries",
          "Adaptable performance format for club and festival stages",
        ],
        missingElements: [
          !hasRider ? "Missing Technical Rider & Stage Plot (Channel list, monitor specs)" : "Needs hospitality rider",
          "Live performance video clip embed (high-energy festival footage)",
        ],
        actionPlan: "Generate an interactive technical rider and add three performance tier packages (Club, Festival, VIP Acoustic).",
      },
      {
        id: "artist_creator",
        persona: "Working Independent Artist & Producer",
        role: "Creative Peer & Community Lead",
        avatarIcon: "User",
        score: bioLength > 100 ? 90 : 70,
        verdict: "Press Ready",
        summary: `The visual aesthetic needs to scream luxury and high taste. Your EPK is your digital business card — it should feel as cinematic as your music videos.`,
        strengths: [
          "Authentic origin story and musical influences",
          "Mobile-optimized presentation for direct DM pitching",
        ],
        missingElements: [
          "Lossless audio player embed for unreleased tracks",
          "Custom vanity domain (e.g. artistname.com)",
        ],
        actionPlan: "Switch to the Dark Gold or Midnight Velvet style archetype with double-bezel glassmorphism cards.",
      },
      {
        id: "pr_publicist",
        persona: "Music PR Agency & Senior Publicist",
        role: "Pitchfork / Rolling Stone / FADER Pitching Perspective",
        avatarIcon: "Newspaper",
        score: hasPress && hasPhotos ? 94 : 65,
        verdict: hasPress && hasPhotos ? "Press Ready" : "Missing Critical Assets",
        summary: `Music journalists receive 200 pitches daily. If your 300DPI press photos, approved bios, and press quotes aren't downloadable in one click, your email gets archived.`,
        strengths: [
          "Press-ready bio that can be copied into editorial features",
          "Clear genre tagging for playlist curator discovery",
        ],
        missingElements: [
          !hasPhotos ? "Missing high-resolution 300 DPI photography zip bundle" : "Need publication quote badges",
          "Embargo date and private streaming links for album premieres",
        ],
        actionPlan: "Populate the High-Res Press Asset Vault with landscape and portrait approved images and link press clippings.",
      },
      {
        id: "vc_investor",
        persona: "Music Tech VC & Creator Economy Investor",
        role: "Venture Fund Partner & Music Catalog Financier",
        avatarIcon: "TrendingUp",
        score: listenersNum > 20000 ? 86 : 72,
        verdict: "High Growth Asset",
        summary: `Evaluating audience acquisition loops, brand sponsorship leverage, and digital conversion efficiency. EPKs with direct ticketing and merch integrations drive 4x higher LTV.`,
        strengths: [
          "Scalable digital asset that converts traffic into booked business",
          "High retention potential through centralized roster management",
        ],
        missingElements: [
          "DocSend-style EPK analytics (Track open rates, listener retention, download triggers)",
          "Brand partnership sponsorship deck section",
        ],
        actionPlan: "Enable EPK view analytics and integrate brand partnership tier deliverables.",
      },
    ];

    let readinessTier: AnalysisResponse["readinessTier"] = "Draft Stage";
    if (overallScore >= 85) readinessTier = "A&R Priority";
    else if (overallScore >= 72) readinessTier = "Festival Ready";
    else if (overallScore >= 55) readinessTier = "Developing Talent";

    const topRecommendations = [
      "Generate an AI-Polished 3-Paragraph Bio tailored for Major Label A&R and Festival Talent Buyers.",
      "Embed direct Spotify, Apple Music, and YouTube media tracks with verified streaming counters.",
      "Activate the High-Res Press Asset Vault with downloadable 300DPI press photos and logos.",
      "Add a Technical Rider & Stage Plot to unlock festival booking inquiries.",
    ];

    return NextResponse.json({
      overallScore,
      readinessTier,
      summary: `Comprehensive evaluation completed for ${artistName || "Artist"}. Scored ${overallScore}/100 across 6 industry personas.`,
      personas,
      topRecommendations,
      suggestedTemplate: hasRider ? "booking" : overallScore > 80 ? "brand" : "main",
      generatedBioHook: `${artistName || "The artist"} blends evocative ${genre || "contemporary"} textures with raw narrative depth, creating an undeniable sonic presence that commands festival stages and streaming algorithms alike.`,
    });
  } catch (error) {
    console.error("EPK Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to generate EPK analysis" },
      { status: 500 }
    );
  }
}
