"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Music2,
  FileText,
  Globe,
  Zap,
  BadgeCheck,
  ChevronRight,
  ArrowRight,
  Play,
  CheckCircle2,
  TrendingUp,
  Download,
  Share2,
  Calendar,
  Building,
  User,
  Newspaper,
  ShieldCheck,
  Disc3,
  ExternalLink,
  Sliders,
  Layers,
  Award,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";

// ── Hero Interactive EPK Showcase ─────────────────────────────────────────────
function HeroEPKPreview() {
  const [activeTab, setActiveTab] = useState<"main" | "booking" | "brand">("main");

  const previewData = {
    main: {
      artist: "KAYLAN VALE",
      tagline: "Atmospheric Alternative R&B / Cinematic Soul",
      genre: "Atlanta, GA · 68.4K Monthly Listeners",
      bio: "Fusing moody vintage synthesizers with modern 808 percussion, Kaylan Vale commands festival stages and streaming algorithms alike.",
      stat1: "3.2M+",
      stat1Label: "Global Streams",
      stat2: "+44%",
      stat2Label: "MoM Growth",
      badge: "Major Label A&R Priority",
      accent: "#C9A227",
    },
    booking: {
      artist: "KAYLAN VALE (LIVE BAND)",
      tagline: "Festival & Tour Booking Kit 2026-2027",
      genre: "4-Piece Live Setup · 24 Channel Input List",
      bio: "High-energy festival performance with live drumming, analog synthesizers, and dedicated lighting cues. Zero backline hassle.",
      stat1: "950",
      stat1Label: "Avg Room Cap",
      stat2: "100%",
      stat2Label: "Sellout Rate",
      badge: "Promoter & Festival Magnet",
      accent: "#C0272D",
    },
    brand: {
      artist: "KAYLAN VALE x BRANDS",
      tagline: "Cultural Influence & Demographic Portfolio",
      genre: "72% Gen-Z / Millennial · 6.8% Engagement Rate",
      bio: "Delivering bespoke cultural activations for premier streetwear, audio gear, and lifestyle partners. Direct high-intent audience.",
      stat1: "6.8%",
      stat1Label: "IG Engagement",
      stat2: "120K+",
      stat2Label: "TikTok Reach",
      badge: "Brand Sponsorship Ready",
      accent: "#38BDF8",
    },
  };

  const current = previewData[activeTab];

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 rounded-3xl bg-[#0C0C0C] border border-[#C9A227]/30 p-2 sm:p-4 shadow-2xl shadow-[#C9A227]/10 relative overflow-hidden group">
      {/* Top Bar with Tab Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#141414] rounded-2xl border border-[#222]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#EF4444]/70" />
          <span className="w-3 h-3 rounded-full bg-[#F59E0B]/70" />
          <span className="w-3 h-3 rounded-full bg-[#10B981]/70" />
          <span className="text-[11px] text-[#777] font-mono ml-2 hidden sm:inline">
            artistsepks.com/@kaylanvale
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {(["main", "booking", "brand"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all",
                activeTab === tab
                  ? "bg-[#C9A227] text-[#050505] shadow-md shadow-[#C9A227]/20"
                  : "bg-[#1C1C1C] text-[#888] hover:text-[#EDE9E0]"
              )}
            >
              {tab === "main" ? "A&R Pitch" : tab === "booking" ? "Booking Kit" : "Brand Deck"}
            </button>
          ))}
        </div>
      </div>

      {/* Live Mockup Inner Canvas */}
      <div className="p-6 sm:p-8 bg-gradient-to-b from-[#111111] via-[#0A0A0A] to-[#050505] rounded-2xl mt-3 border border-[#1E1E1E] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#222]">
          <div className="space-y-1">
            <Badge className="bg-[#C9A227]/15 text-[#C9A227] border-[#C9A227]/30 text-[10px] uppercase tracking-wider mb-1">
              {current.badge}
            </Badge>
            <h3 className="font-display text-3xl sm:text-5xl uppercase tracking-wide text-[#EDE9E0]">
              {current.artist}
            </h3>
            <p className="text-xs text-[#C9A227] font-medium">{current.tagline}</p>
            <p className="text-[11px] text-[#777]">{current.genre}</p>
          </div>

          <div className="flex items-center gap-4 bg-[#141414] p-3 rounded-xl border border-[#262626]">
            <div>
              <p className="text-xl font-display text-[#EDE9E0]">{current.stat1}</p>
              <p className="text-[10px] text-[#888] uppercase">{current.stat1Label}</p>
            </div>
            <div className="w-px h-8 bg-[#2A2A2A]" />
            <div>
              <p className="text-xl font-display text-[#22C55E]">{current.stat2}</p>
              <p className="text-[10px] text-[#888] uppercase">{current.stat2Label}</p>
            </div>
          </div>
        </div>

        {/* Mock Audio Player & Bio Snippet */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-3">
            <p className="text-xs text-[#AAA] leading-relaxed">
              {current.bio}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-[#666] uppercase tracking-wider">Features:</span>
              <span className="text-[10px] text-[#DDD] bg-[#181818] px-2 py-0.5 rounded border border-[#2A2A2A]">
                Spotify Synced
              </span>
              <span className="text-[10px] text-[#DDD] bg-[#181818] px-2 py-0.5 rounded border border-[#2A2A2A]">
                300 DPI Press Vault
              </span>
              <span className="text-[10px] text-[#DDD] bg-[#181818] px-2 py-0.5 rounded border border-[#2A2A2A]">
                PDF One-Sheet
              </span>
            </div>
          </div>

          <div className="md:col-span-5 p-4 rounded-xl bg-[#141414] border border-[#282828] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#C9A227] flex items-center justify-center text-[#050505] font-bold">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#EDE9E0]">Midnight Velvet (Master)</p>
                  <p className="text-[10px] text-[#888]">Direct Uncompressed Stream</p>
                </div>
              </div>
              <span className="text-[10px] text-[#C9A227] font-mono">3:24</span>
            </div>
            <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#C9A227] h-full w-2/3" />
            </div>
          </div>
        </div>

        {/* Watermark bar */}
        <div className="pt-4 border-t border-[#1C1C1C] flex items-center justify-between text-[11px] text-[#777]">
          <div className="flex items-center gap-2">
            <img src="/artispreneur-logo.png" alt="Artispreneur" className="w-4 h-4 object-contain" />
            <span>Powered by Artispreneur Ecosystem</span>
          </div>
          <Link href="/builder" className="text-[#C9A227] hover:underline flex items-center gap-1 font-medium">
            <span>Customize This EPK in Studio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Free AI Bio Generator Homepage Widget ──────────────────────────────────────
function HomepageBioGenerator() {
  const [artistName, setArtistName] = useState("KAYLAN VALE");
  const [genre, setGenre] = useState("Alternative R&B / Cinematic Soul");
  const [location, setLocation] = useState("Atlanta, GA");
  const [influences, setInfluences] = useState("Frank Ocean, SZA, The Weeknd");
  const [highlights, setHighlights] = useState("3M+ streams on Spotify, featured on Soul Lounge playlist");
  const [tone, setTone] = useState<"major" | "booking" | "press" | "onesheet">("major");

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    tagline: string;
    bio: string;
    paragraphs: string[];
  } | null>({
    tagline: "The Next Signature Voice in Alternative R&B / Cinematic Soul",
    bio: `With an undeniable sonic identity and commanding commercial momentum, KAYLAN VALE is rapidly ascending as one of the most exciting new forces in Alternative R&B / Cinematic Soul. Operating out of Atlanta, GA, the artist combines world-class songwriting chops with forward-thinking production that demands attention from the first bar.\n\nSynthesizing the foundational essence of Frank Ocean, SZA, The Weeknd into a fresh, contemporary framework, KAYLAN VALE's sound balances mainstream playlist appeal with authentic artistry. Strengthened by milestones including 3M+ streams on Spotify, featured on Soul Lounge playlist, their organic streaming trajectory reflects a deeply engaged, rapidly expanding global audience.\n\nBacked by a relentless work ethic and an undeniable creative vision, KAYLAN VALE is positioned for breakout crossover success across DSP algorithms, global festival stages, and major cultural partnerships.`,
    paragraphs: [
      `With an undeniable sonic identity and commanding commercial momentum, KAYLAN VALE is rapidly ascending as one of the most exciting new forces in Alternative R&B / Cinematic Soul. Operating out of Atlanta, GA, the artist combines world-class songwriting chops with forward-thinking production that demands attention from the first bar.`,
      `Synthesizing the foundational essence of Frank Ocean, SZA, The Weeknd into a fresh, contemporary framework, KAYLAN VALE's sound balances mainstream playlist appeal with authentic artistry. Strengthened by milestones including 3M+ streams on Spotify, featured on Soul Lounge playlist, their organic streaming trajectory reflects a deeply engaged, rapidly expanding global audience.`,
      `Backed by a relentless work ethic and an undeniable creative vision, KAYLAN VALE is positioned for breakout crossover success across DSP algorithms, global festival stages, and major cultural partnerships.`,
    ],
  });

  const handleGenerate = async () => {
    if (!artistName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/bio-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistName,
          genre,
          location,
          influences,
          highlights,
          tone,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedResult(data);
      }
    } catch (err) {
      console.error("Failed to generate bio:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedResult?.bio) return;
    navigator.clipboard.writeText(generatedResult.bio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleProfiles = [
    {
      name: "KAYLAN VALE",
      genre: "Alternative R&B / Cinematic Soul",
      location: "Atlanta, GA",
      influences: "Frank Ocean, SZA, The Weeknd",
      highlights: "3M+ streams on Spotify, featured on Soul Lounge playlist",
    },
    {
      name: "NEON MIRAGE",
      genre: "Synthwave / Live Electronic",
      location: "Brooklyn, NY",
      influences: "Daft Punk, Justice, Tycho",
      highlights: "Sold out Bowery Ballroom, over 800k monthly Spotify listeners",
    },
    {
      name: "MARLOWE GREY",
      genre: "Indie Folk / Americana",
      location: "Nashville, TN",
      influences: "Phoebe Bridgers, Bon Iver, Gregory Alan Isakov",
      highlights: "NPR Tiny Desk contest finalist, opened for Lord Huron",
    },
  ];

  return (
    <section id="bio-generator" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1C1C1C] relative scroll-mt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#C9A227]/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#C9A227]/30 text-xs font-medium text-[#C9A227]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free Music Tool</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider text-[#EDE9E0]">
            Free AI Artist <span className="text-[#C9A227]">Bio Generator</span>
          </h2>

          <p className="text-sm text-[#A0A0A0] max-w-xl mx-auto">
            Generate press-ready, third-person artist bios in seconds. Tailored for Major Label A&Rs,
            Festival Promoters, and Music Publicists.
          </p>

          {/* Quick load sample pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-[#777] uppercase tracking-wider font-semibold">
              Try Sample:
            </span>
            {sampleProfiles.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setArtistName(p.name);
                  setGenre(p.genre);
                  setLocation(p.location);
                  setInfluences(p.influences);
                  setHighlights(p.highlights);
                }}
                className="px-2.5 py-1 rounded-md text-xs bg-[#111] hover:bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#C9A227]/50 text-[#BBB] transition-colors"
              >
                {p.name} ({p.genre.split("/")[0].trim()})
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Generator Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Controls (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0D0D0D] border border-[#222] space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
                1. Artist Details
              </span>
              <span className="text-[10px] text-[#777]">AI Pitch Engine</span>
            </div>

            <div className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1 font-medium">
                  Artist or Band Name
                </label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] focus:border-[#C9A227] text-[#EDE9E0] focus:outline-none text-sm"
                  placeholder="e.g. KAYLAN VALE"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#888] uppercase tracking-wider mb-1 font-medium">
                    Genre / Style
                  </label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] focus:border-[#C9A227] text-[#EDE9E0] focus:outline-none text-sm"
                    placeholder="e.g. Alternative R&B"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#888] uppercase tracking-wider mb-1 font-medium">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] focus:border-[#C9A227] text-[#EDE9E0] focus:outline-none text-sm"
                    placeholder="e.g. Atlanta, GA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1 font-medium">
                  Key Influences / Soundalike
                </label>
                <input
                  type="text"
                  value={influences}
                  onChange={(e) => setInfluences(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] focus:border-[#C9A227] text-[#EDE9E0] focus:outline-none text-sm"
                  placeholder="e.g. Frank Ocean, SZA, The Weeknd"
                />
              </div>

              <div>
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1 font-medium">
                  Story Highlights / Milestones
                </label>
                <textarea
                  rows={2}
                  value={highlights}
                  onChange={(e) => setHighlights(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] focus:border-[#C9A227] text-[#EDE9E0] focus:outline-none text-sm resize-none"
                  placeholder="e.g. 3M+ streams, opened for major acts, Spotify playlisting..."
                />
              </div>

              {/* Tone Selection Tabs */}
              <div>
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1.5 font-medium">
                  Select Bio Tone
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: "major", label: "A&R Major Pitch" },
                    { id: "booking", label: "Festival / Booking" },
                    { id: "press", label: "Indie / Press" },
                    { id: "onesheet", label: "1-Para One-Sheet" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTone(t.id as any)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-all",
                        tone === t.id
                          ? "bg-[#C9A227] text-[#050505] font-bold border-[#C9A227] shadow-sm"
                          : "bg-[#141414] text-[#AAA] border-[#262626] hover:border-[#444]"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="gold"
                size="lg"
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-[#C9A227] hover:bg-[#d8b030] text-[#050505] font-bold tracking-wider uppercase text-xs h-11 shadow-lg shadow-[#C9A227]/20"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Bio...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Generate Press Bio Free
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Right Output Card (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-[#C9A227]/30 shadow-2xl relative space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#222]">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C9A227] font-semibold">
                    {tone === "major"
                      ? "Major Label A&R Tone"
                      : tone === "booking"
                      ? "Festival Booking Tone"
                      : tone === "press"
                      ? "Editorial Press Tone"
                      : "One-Sheet Executive Hook"}
                  </span>
                  <h3 className="font-display text-2xl uppercase tracking-wide text-[#EDE9E0]">
                    {artistName || "Artist Bio Preview"}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="border-[#333] hover:border-[#C9A227] text-xs gap-1.5 text-[#DDD]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                        <span className="text-[#22C55E]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>Copy Bio</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Tagline Badge */}
              {generatedResult?.tagline && (
                <div className="p-3 rounded-lg bg-[#141414] border border-[#242424] text-xs text-[#C9A227] font-medium flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider bg-[#C9A227]/20 px-1.5 py-0.5 rounded font-bold">
                    TAGLINE
                  </span>
                  <span>{generatedResult.tagline}</span>
                </div>
              )}

              {/* Bio Paragraphs */}
              <div className="space-y-3.5 text-xs sm:text-sm text-[#CCC] leading-relaxed font-sans min-h-[160px]">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3 text-center">
                    <RefreshCw className="w-6 h-6 text-[#C9A227] animate-spin" />
                    <p className="text-xs text-[#888]">Writing press-ready narrative...</p>
                  </div>
                ) : generatedResult ? (
                  generatedResult.paragraphs.map((p, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {p}
                    </p>
                  ))
                ) : (
                  <p className="text-[#777] italic">
                    Click &ldquo;Generate Press Bio Free&rdquo; to create your bio.
                  </p>
                )}
              </div>

              {/* Bottom Actions inside output card */}
              <div className="pt-4 border-t border-[#1F1F1F] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#777]">
                <span>
                  {generatedResult?.bio ? `${generatedResult.bio.split(/\s+/).length} words · 3rd-person press ready` : "Ready to generate"}
                </span>

                {generatedResult?.bio && (
                  <Button
                    variant="gold"
                    size="sm"
                    asChild
                    className="bg-[#C9A227] text-[#050505] font-bold uppercase tracking-wider text-xs shadow-md"
                  >
                    <Link
                      href={`/builder?artist=${encodeURIComponent(artistName)}&genre=${encodeURIComponent(genre)}&bio=${encodeURIComponent(generatedResult.bio)}`}
                    >
                      <span>Build EPK With This Bio</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Persona Switcher Section ──────────────────────────────────────────────────
function PersonaSection() {
  const [activePersona, setActivePersona] = useState<number>(0);

  const personas = [
    {
      role: "Independent Artists",
      icon: User,
      title: "Look Like A Signed Major Act in 5 Minutes",
      desc: "Stop staring at blank pages or pasting messy Spotify links. Our AI writes press-ready bios, pulls your streaming releases, and creates a breathtaking deck ready for any pitch.",
      bullets: ["AI Bio & Pitch Hook Generator", "Instant Spotify & Apple Music Sync", "Downloadable One-Sheet PDF"],
      cta: "Build Artist EPK Free",
      link: "/builder",
    },
    {
      role: "Artist Managers",
      icon: Sliders,
      title: "Book Festivals & Track Promoter Interest",
      desc: "Get real-time DocSend-style analytics. Know the second a festival talent buyer opens your deck, which tracks they play, and export 24-channel technical stage plots with one click.",
      bullets: ["DocSend-style Viewer Analytics", "Interactive Tech Rider Builder", "Multi-Artist Roster Management"],
      cta: "Explore Manager Tools",
      link: "/solutions#managers",
    },
    {
      role: "Record Labels",
      icon: Building,
      title: "Standardize Release Rollouts & Sync Cues",
      desc: "Centralize your entire catalog's press kits. Equip sync music supervisors with BPM, Key, and 100% one-stop publishing clearance confirmation badges.",
      bullets: ["Sync Licensing Reel Metadata", "Single & Album Rollout Kits", "300DPI High-Res Media Vaults"],
      cta: "Explore Label Suite",
      link: "/solutions#labels",
    },
    {
      role: "Music Publicists",
      icon: Newspaper,
      title: "Zero-Friction Press Assets for Journalists",
      desc: "Editors under tight print deadlines will love you. Provide one-click 300DPI photo ZIP bundles, verified publication quote cards, and embargoed pre-release links.",
      bullets: ["1-Click Press Asset ZIP Bundle", "Embargo Date & Password Links", "Publication Quote Verification"],
      cta: "Publicist Features",
      link: "/features",
    },
    {
      role: "Music Tech Investors",
      icon: TrendingUp,
      title: "Venture-Scale Creator Economy Platform",
      desc: "Powered by a viral product-led growth (PLG) loop: every public artist EPK footer drives organic inbound customer acquisition across global music hubs.",
      bullets: ["Defensible Artist Data Layer", "Low CAC via Public Watermarks", "Artispreneur Business Framework"],
      cta: "Generate Free Bio",
      link: "/#bio-generator",
    },
  ];

  const current = personas[activePersona];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#1C1C1C] relative">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="gold" className="px-3 py-1 text-xs">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Multi-Stakeholder Platform
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider text-[#EDE9E0]">
            Built For Every <span className="text-[#C9A227]">Music Power Player</span>
          </h2>
          <p className="text-sm text-[#888] max-w-xl mx-auto">
            From DIY solo artists to venture-backed labels, discover how ArtistEPKs elevates your workflow.
          </p>
        </div>

        {/* Persona Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {personas.map((p, idx) => (
            <button
              key={p.role}
              type="button"
              onClick={() => setActivePersona(idx)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2",
                activePersona === idx
                  ? "bg-[#C9A227] text-[#050505] font-bold shadow-lg shadow-[#C9A227]/20"
                  : "bg-[#111] text-[#999] border border-[#262626] hover:border-[#444] hover:text-[#EDE9E0]"
              )}
            >
              <p.icon className="w-3.5 h-3.5" />
              <span>{p.role}</span>
            </button>
          ))}
        </div>

        {/* Active Persona Box */}
        <motion.div
          key={current.role}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto rounded-3xl bg-[#0D0D0D] border border-[#262626] p-8 sm:p-10 shadow-2xl space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#181818] border border-[#333] flex items-center justify-center">
              <current.icon className="w-5 h-5 text-[#C9A227]" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C9A227] font-semibold">
                {current.role} Solution
              </span>
              <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-[#EDE9E0]">
                {current.title}
              </h3>
            </div>
          </div>

          <p className="text-sm text-[#A0A0A0] leading-relaxed">
            {current.desc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {current.bullets.map((b, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#141414] border border-[#222] flex items-center gap-2 text-xs text-[#DDD]">
                <CheckCircle2 className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#1E1E1E] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#777]">
              Backed by Artispreneur business intelligence
            </span>
            <Button variant="gold" size="sm" asChild className="bg-[#C9A227] text-[#050505] font-bold uppercase text-xs">
              <Link href={current.link}>
                <span>{current.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Comparison Table ──────────────────────────────────────────────────────────
function ComparisonSection() {
  const rows = [
    { feature: "AI Bio & Story Writing Engine", us: true, pdf: false, linktree: false, website: "Requires Manual Copy" },
    { feature: "Live Spotify & Apple DSP Sync", us: true, pdf: false, linktree: "Basic Links Only", website: "Complex Embeds" },
    { feature: "Interactive 24-Ch Tech Rider", us: true, pdf: "Static File", linktree: false, website: "Static Table" },
    { feature: "300DPI Press Asset ZIP Bundle", us: true, pdf: false, linktree: false, website: "Requires Cloud Storage" },
    { feature: "DocSend-Style Viewer Analytics", us: true, pdf: false, linktree: "Basic Clicks", website: "Google Analytics (Complex)" },
    { feature: "Vector Print PDF & One-Sheet Export", us: true, pdf: true, linktree: false, website: false },
    { feature: "Setup Time", us: "3-5 Minutes", pdf: "4-8 Hours", linktree: "15 Minutes", website: "1-3 Weeks" },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#1C1C1C]">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="gold" className="px-3 py-1 text-xs">
            <Zap className="w-3.5 h-3.5 mr-1.5" /> Competitive Edge
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider text-[#EDE9E0]">
            Why Modern Artists Choose <span className="text-[#C9A227]">ArtistEPKs</span>
          </h2>
          <p className="text-sm text-[#888] max-w-xl mx-auto">
            See how ArtistEPKs compares to outdated PDFs, link-in-bio widgets, and bloated websites.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0D0D0D] border border-[#222] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141414] border-b border-[#222] text-[#888] uppercase tracking-wider">
                <tr>
                  <th className="p-4 sm:p-5 font-semibold">Capability</th>
                  <th className="p-4 sm:p-5 font-bold text-[#C9A227] bg-[#C9A227]/10 border-x border-[#C9A227]/20">
                    ArtistEPKs (Artispreneur)
                  </th>
                  <th className="p-4 sm:p-5 font-semibold">Static PDF</th>
                  <th className="p-4 sm:p-5 font-semibold">Linktree / Link-in-Bio</th>
                  <th className="p-4 sm:p-5 font-semibold">WordPress / Wix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C] text-[#AAA]">
                {rows.map((r, i) => (
                  <tr key={i} className="hover:bg-[#111] transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-[#EDE9E0]">{r.feature}</td>
                    <td className="p-4 sm:p-5 bg-[#C9A227]/5 border-x border-[#C9A227]/20 font-semibold text-[#22C55E]">
                      {typeof r.us === "boolean" ? "✓ Included" : r.us}
                    </td>
                    <td className="p-4 sm:p-5">
                      {typeof r.pdf === "boolean" ? (r.pdf ? "✓ Yes" : "✕ No") : r.pdf}
                    </td>
                    <td className="p-4 sm:p-5">
                      {typeof r.linktree === "boolean" ? (r.linktree ? "✓ Yes" : "✕ No") : r.linktree}
                    </td>
                    <td className="p-4 sm:p-5">
                      {typeof r.website === "boolean" ? (r.website ? "✓ Yes" : "✕ No") : r.website}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main Home Page ────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#EDE9E0]">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-[#C9A227]/10 blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          {/* Artispreneur Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#111] border border-[#C9A227]/40 shadow-lg shadow-[#C9A227]/5">
            <img src="/artispreneur-logo.png" alt="Artispreneur" className="w-5 h-5 object-contain" />
            <span className="text-xs uppercase tracking-widest text-[#EDE9E0] font-semibold">
              Powered by <span className="text-[#C9A227]">Artispreneur</span>
            </span>
          </div>

          <h1 className="font-display text-[clamp(2.8rem,7vw,6.5rem)] leading-none tracking-wider text-[#EDE9E0]">
            THE EPK PLATFORM THAT GETS YOU<br />
            <span className="text-[#C9A227]">BOOKED, STREAMED &amp; SIGNED.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#A0A0A0] leading-relaxed">
            Create high-impact Electronic Press Kits in minutes. AI writes your bio,
            pulls your live stats from Spotify &amp; Apple Music, generates technical riders,
            and delivers stunning Vector PDFs + hosted pages.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              variant="gold"
              size="xl"
              asChild
              className="bg-[#C9A227] hover:bg-[#d8b030] text-[#050505] font-bold uppercase text-xs tracking-wider h-12 px-8 shadow-xl shadow-[#C9A227]/20"
            >
              <Link href="/builder" className="flex items-center gap-2">
                <span>Build Your EPK Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              asChild
              className="border-[#C9A227]/30 text-[#EDE9E0] hover:border-[#C9A227] hover:bg-[#C9A227]/10 h-12 px-8"
            >
              <a href="#bio-generator" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
                <span>Free Bio Generator</span>
              </a>
            </Button>
          </div>

          {/* Interactive Live Demo */}
          <HeroEPKPreview />
        </div>
      </section>

      {/* Free AI Bio Generator Homepage Section */}
      <HomepageBioGenerator />

      {/* Stakeholder Persona Section */}
      <PersonaSection />

      {/* Comparison Matrix */}
      <ComparisonSection />

      {/* Final Call to Action */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#1C1C1C] text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#C9A227]/10 blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <img
            src="/artispreneur-logo.png"
            alt="Artispreneur"
            className="w-14 h-14 mx-auto object-contain"
          />
          <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-wider text-[#EDE9E0]">
            Ready To Upgrade Your <span className="text-[#C9A227]">Music Career?</span>
          </h2>
          <p className="text-sm text-[#A0A0A0] max-w-xl mx-auto">
            Join thousands of independent artists, managers, and labels using Artispreneur technology to pitch with confidence.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="gold"
              size="xl"
              asChild
              className="bg-[#C9A227] text-[#050505] font-bold uppercase text-xs h-12 px-8 shadow-xl shadow-[#C9A227]/20"
            >
              <Link href="/builder">Launch EPK Studio Free</Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              asChild
              className="border-[#333] text-[#EDE9E0] h-12 px-8"
            >
              <Link href="/templates">Explore Template Catalog</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
