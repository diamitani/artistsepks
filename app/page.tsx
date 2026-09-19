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
  Tv,
} from "lucide-react";

// ── SECTION 1: What is an EPK? (Dual Section) ────────────────────────────────
function WhatIsAnEPKSection() {
  const [activeTab, setActiveTab] = useState<"modern" | "legacy">("modern");

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#1C1C1C] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#C9A227]/5 rounded-full blur-[160px] pointer-events-none -translate-x-1/2" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ── LEFT COLUMN: Industry Context & Core Value ── */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111] border border-[#C9A227]/30 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="text-[11px] uppercase tracking-widest text-[#C9A227] font-semibold">
                Industry Standard · The Artist Resume
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider text-[#EDE9E0] leading-[1.05]">
              What Is An <span className="text-[#C9A227]">EPK?</span>
            </h2>

            <p className="text-sm sm:text-base text-[#AAA] leading-relaxed">
              An <strong className="text-[#EDE9E0]">Electronic Press Kit (EPK)</strong> is an artist&apos;s digital identity, interactive business portfolio, and pitch engine. It is the single link sent to <strong className="text-[#EDE9E0]">Record Labels, Festival Talent Buyers, Music Supervisors, Booking Agents, and Journalists</strong> to evaluate talent in 30 seconds or less.
            </p>

            {/* 4 Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#0D0D0D] border border-[#222] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#EDE9E0]">
                  <Zap className="w-4 h-4 text-[#C9A227]" />
                  <span>30-Second A&amp;R Scan</span>
                </div>
                <p className="text-[11px] text-[#777] leading-normal">
                  Curated visual hierarchy that hooks busy label executives instantly.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D0D0D] border border-[#222] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#EDE9E0]">
                  <Play className="w-4 h-4 text-[#C9A227]" />
                  <span>Lossless Direct Stream</span>
                </div>
                <p className="text-[11px] text-[#777] leading-normal">
                  Embedded uncompressed audio &amp; 4K video with zero external app redirects.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D0D0D] border border-[#222] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#EDE9E0]">
                  <Download className="w-4 h-4 text-[#C9A227]" />
                  <span>300 DPI Asset Vault</span>
                </div>
                <p className="text-[11px] text-[#777] leading-normal">
                  One-click ZIP downloads for approved press photos, logos &amp; riders.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D0D0D] border border-[#222] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#EDE9E0]">
                  <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                  <span>Rights &amp; Booking Direct</span>
                </div>
                <p className="text-[11px] text-[#777] leading-normal">
                  Pre-cleared splits, management contacts, and direct inquiry channels.
                </p>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex items-center gap-4">
              <Button
                variant="gold"
                asChild
                className="bg-[#C9A227] hover:bg-[#d8b030] text-[#050505] font-bold uppercase text-xs tracking-wider h-11 px-6 rounded-xl shadow-lg shadow-[#C9A227]/20"
              >
                <Link href="/builder" className="flex items-center gap-2">
                  <span>Create Your Free EPK</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
              <Link
                href="/features"
                className="text-xs text-[#888] hover:text-[#EDE9E0] transition-colors flex items-center gap-1 font-medium"
              >
                <span>See all 14 EPK modules</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Interactive Comparison Card ── */}
          <div className="lg:col-span-6 space-y-4">
            {/* Switcher Toggle */}
            <div className="flex items-center justify-between p-2 rounded-2xl bg-[#0F0F0F] border border-[#222]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#777] px-3">
                Comparison:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("modern")}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5",
                    activeTab === "modern"
                      ? "bg-[#C9A227] text-[#050505] shadow-md shadow-[#C9A227]/20"
                      : "text-[#888] hover:text-[#EDE9E0]"
                  )}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Modern Interactive EPK</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("legacy")}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all",
                    activeTab === "legacy"
                      ? "bg-[#C0272D] text-white shadow-md shadow-[#C0272D]/20"
                      : "text-[#888] hover:text-[#EDE9E0]"
                  )}
                >
                  <span>Outdated PDF / Linktree</span>
                </button>
              </div>
            </div>

            {/* Dynamic Card */}
            <AnimatePresence mode="wait">
              {activeTab === "modern" ? (
                <motion.div
                  key="modern-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#080808] border border-[#C9A227]/30 shadow-2xl space-y-5"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-[#222]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#C9A227]/15 flex items-center justify-center">
                        <BadgeCheck className="w-5 h-5 text-[#C9A227]" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#C9A227] font-semibold">
                          ArtistEPKs Standard
                        </span>
                        <h4 className="text-base font-bold text-[#EDE9E0]">
                          Interactive · Dynamic · Instant
                        </h4>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[10px] text-[#22C55E] font-bold uppercase tracking-wider">
                      98% A&amp;R Open Rate
                    </span>
                  </div>

                  <div className="space-y-3 text-xs text-[#CCC]">
                    <div className="p-3 rounded-xl bg-[#141414] border border-[#222] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4 text-[#C9A227]" />
                        <span className="font-medium text-[#EDE9E0]">Playable Focus Track (Lossless)</span>
                      </div>
                      <span className="text-[10px] text-[#22C55E] font-mono">Synced to Spotify</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#141414] border border-[#222] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#C9A227]" />
                        <span className="font-medium text-[#EDE9E0]">Live DSP Streaming Analytics</span>
                      </div>
                      <span className="text-[10px] text-[#888] font-mono">3.2M Streams · Real-time</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#141414] border border-[#222] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-[#C9A227]" />
                        <span className="font-medium text-[#EDE9E0]">300DPI Press ZIP &amp; Vector PDF</span>
                      </div>
                      <span className="text-[10px] text-[#C9A227] font-mono">1-Click Package</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#666]">
                    <span>Hosted on your custom domain</span>
                    <span className="text-[#C9A227] font-medium">Sub-second load time</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="legacy-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 sm:p-7 rounded-2xl bg-[#0D0D0D] border border-[#C0272D]/30 shadow-2xl space-y-5"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-[#222]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#C0272D]/15 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#C0272D]" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#C0272D] font-semibold">
                          Legacy 2015 Method
                        </span>
                        <h4 className="text-base font-bold text-[#EDE9E0]">
                          Static PDF Attachments &amp; Linktree
                        </h4>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#C0272D]/15 border border-[#C0272D]/30 text-[10px] text-[#C0272D] font-bold uppercase tracking-wider">
                      84% Rejection Rate
                    </span>
                  </div>

                  <div className="space-y-3 text-xs text-[#AAA]">
                    <div className="p-3 rounded-xl bg-[#141414] border border-[#262626] flex items-center gap-2 text-[#EF4444]">
                      <span className="font-bold">✕</span>
                      <span>40MB file size gets blocked by corporate label email spam filters</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141414] border border-[#262626] flex items-center gap-2 text-[#EF4444]">
                      <span className="font-bold">✕</span>
                      <span>No audio preview — forces industry reps to open 4 different browser tabs</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141414] border border-[#262626] flex items-center gap-2 text-[#EF4444]">
                      <span className="font-bold">✕</span>
                      <span>Stats are static and out of date two weeks after you export the file</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#888] italic">
                    Industry standard has shifted: A&amp;Rs demand interactive web portfolios with direct media playback.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── SECTION 2: 5 Specialized EPK Types (Dual Section) ────────────────────────
function EPKTypesSection() {
  const [activeType, setActiveType] = useState<number>(0);

  const epkTypes = [
    {
      id: "release",
      icon: Disc3,
      title: "Single & Album Launch EPK",
      badge: "Release Campaign & DSP Pitch",
      target: "Spotify/Apple Editors, Music Blogs, Playlist Curators",
      desc: "Spotlights your upcoming or newly dropped focus single/album with unreleased audio previews, high-res cover art, pre-save smart links, lyric breakdowns, and a tailored press angle.",
      modules: ["Focus Track Lossless Player", "Pre-Save & DSP Smart Links", "Single Artwork (3000x3000px)", "Official Music Video Embed", "Campaign Press Angle"],
      metricSample: "42K Pre-Saves · Added to 18 Editorial Playlists",
      accent: "#C9A227",
    },
    {
      id: "booking",
      icon: Calendar,
      title: "Tour & Live Booking Kit",
      badge: "Talent Buyers & Festival Promoters",
      target: "Festival Bookers, Venue Talent Buyers, Promoters, Production Crews",
      desc: "Everything a live music promoter or production manager needs to book you. Features an interactive 24-channel technical rider, stage plot diagram, live performance video reel, and past ticket sales data.",
      modules: ["Interactive Stage Plot", "24-Channel Input List & Tech Rider", "Live Show Sizzle Reel (4K)", "Room Capacity & Ticket History", "Hospitality & Travel Rider"],
      metricSample: "Avg Cap: 850 · 100% Sellout · 4-Piece Band",
      accent: "#C0272D",
    },
    {
      id: "major",
      icon: TrendingUp,
      title: "A&R / Major Label & Investor Deck",
      badge: "Label Scouts & Venture Backers",
      target: "Major Label A&Rs (Sony, UMG, Warner), Indie Label Heads, Music Funds",
      desc: "Designed to prove commercial viability and rapid audience growth. Highlights Spotify streaming velocity graphs, demographic retention data, playlist distribution, and catalog ownership breakdown.",
      modules: ["DSP Streaming Velocity Chart", "Audience Demographics Breakdown", "Social Engagement Multiplier", "Master & Publishing Ownership", "Executive One-Sheet Hook"],
      metricSample: "+44% MoM Streaming Velocity · 3.2M Streams",
      accent: "#22C55E",
    },
    {
      id: "sync",
      icon: Tv,
      title: "Sync & TV/Film Licensing Kit",
      badge: "Music Supervisors & Media Placement",
      target: "Film/TV Music Supervisors, Ad Agency Producers, Video Game Audio Leads",
      desc: "Zero-friction music licensing hub. Provides instrumental stems, mood & tempo BPM tags, lyric sheets, and verified 100% one-stop pre-cleared master and publishing splits.",
      modules: ["Instrumental & Vocal Stems", "BPM, Key & Mood Metadata", "100% One-Stop Clearance Badge", "Master & Publishing Split Sheet", "Broadcast Quality WAV Downloads"],
      metricSample: "100% Pre-Cleared One-Stop · 128 BPM · E Minor",
      accent: "#38BDF8",
    },
    {
      id: "press",
      icon: Newspaper,
      title: "Press & Media Outreach EPK",
      badge: "Music Journalists & Publicists",
      target: "Rolling Stone, Pitchfork, Billboard, NPR Tiny Desk, Complex Editors",
      desc: "Built specifically for music writers and print editors on deadline. Offers a 1-click ZIP bundle of approved 300DPI press photos, verified review pull quotes, and 3rd-person biography variations.",
      modules: ["300 DPI Photo Download ZIP", "Short / Medium / Long Bios", "Verified Publication Quote Cards", "Recent Press Coverage Links", "Embargo Date & Password Gate"],
      metricSample: "Featured in Pitchfork, FADER & NPR Tiny Desk",
      accent: "#A855F7",
    },
  ];

  const current = epkTypes[activeType];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#1C1C1C] relative bg-[#070707]">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="gold" className="px-3.5 py-1 text-xs">
            <Layers className="w-3.5 h-3.5 mr-1.5" /> 5 Dedicated Formats
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider text-[#EDE9E0]">
            The 5 Essential <span className="text-[#C9A227]">EPK Types</span>
          </h2>
          <p className="text-sm text-[#888]">
            One generic kit doesn&apos;t fit every opportunity. Switch between purpose-built EPK architectures engineered for specific music industry targets.
          </p>
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ── LEFT COLUMN: 5 Type Selector Tabs (5 Cols) ── */}
          <div className="lg:col-span-5 space-y-2.5">
            {epkTypes.map((t, idx) => {
              const Icon = t.icon;
              const isActive = activeType === idx;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveType(idx)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 group",
                    isActive
                      ? "bg-[#141414] border-[#C9A227] shadow-xl shadow-[#C9A227]/10"
                      : "bg-[#0B0B0B] border-[#1E1E1E] hover:border-[#333] hover:bg-[#101010]"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                      isActive ? "bg-[#C9A227] text-[#050505]" : "bg-[#161616] text-[#888] group-hover:text-[#EDE9E0]"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={cn(
                          "text-sm font-bold uppercase tracking-wider transition-colors",
                          isActive ? "text-[#EDE9E0]" : "text-[#999] group-hover:text-[#DDD]"
                        )}
                      >
                        {t.title}
                      </h4>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#666] line-clamp-1">
                      {t.target}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── RIGHT COLUMN: Live Interactive Type Blueprint (7 Cols) ── */}
          <div className="lg:col-span-7">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#080808] border border-[#282828] shadow-2xl space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#222]">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C9A227] font-semibold">
                    {current.badge}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-[#EDE9E0]">
                    {current.title}
                  </h3>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#181818] border border-[#333] text-[11px] text-[#BBB] flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Target: {current.target.split(",")[0]}</span>
                </div>
              </div>

              <p className="text-sm text-[#AAA] leading-relaxed">
                {current.desc}
              </p>

              {/* Sample Metrics Strip */}
              <div className="p-3.5 rounded-xl bg-[#141414] border border-[#222] flex items-center justify-between">
                <span className="text-xs text-[#888] uppercase tracking-wider font-semibold">
                  Key Metric Signal:
                </span>
                <span className="text-xs font-bold text-[#22C55E]">
                  {current.metricSample}
                </span>
              </div>

              {/* Key Architecture Modules */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#777]">
                  Modules Included In This Blueprint:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {current.modules.map((m, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-[#0A0A0A] border border-[#1E1E1E] flex items-center gap-2 text-xs text-[#DDD]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-[#1F1F1F] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-[#666]">
                  Exports to hosted web link + 300DPI vector PDF
                </span>
                <Button
                  variant="gold"
                  size="sm"
                  asChild
                  className="bg-[#C9A227] text-[#050505] font-bold uppercase tracking-wider text-xs"
                >
                  <Link href={`/builder?template=${current.id}`}>
                    <span>Build {current.title.split(" ")[0]} Kit</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── SECTION 3: High-Converting EPK Design System (Dual Section) ──────────────
function EPKDesignSystemSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#1C1C1C] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#C9A227]/6 rounded-full blur-[180px] pointer-events-none translate-x-1/3" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ── LEFT COLUMN: Design System Principles ── */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111] border border-[#C9A227]/30 shadow-md">
              <Award className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="text-[11px] uppercase tracking-widest text-[#C9A227] font-semibold">
                Artispreneur Standard · Anti-Slop Architecture
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider text-[#EDE9E0] leading-[1.05]">
              Engineered For <span className="text-[#C9A227]">Visual Excellence</span>
            </h2>

            <p className="text-sm sm:text-base text-[#AAA] leading-relaxed">
              Every EPK generated on our platform enforces the Artispreneur Design System. We ban generic AI-slop and cluttered widgets in favor of intentional luxury obsidian dark aesthetics, editorial typography pairing, and strict 8-module conversion hierarchy.
            </p>

            {/* 4 Design Pillars */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[#0D0D0D] border border-[#222]">
                <div className="w-8 h-8 rounded-lg bg-[#C9A227]/15 flex items-center justify-center flex-shrink-0 text-[#C9A227] font-bold text-xs">
                  01
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#EDE9E0] uppercase tracking-wide">
                    Obsidian &amp; Warm Gold Palette
                  </h4>
                  <p className="text-[11px] text-[#777] leading-normal">
                    #080808 deep obsidian surface, #141414 cards, and #C9A227 metallic gold accents passing strict WCAG 2.2 AA contrast.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[#0D0D0D] border border-[#222]">
                <div className="w-8 h-8 rounded-lg bg-[#C9A227]/15 flex items-center justify-center flex-shrink-0 text-[#C9A227] font-bold text-xs">
                  02
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#EDE9E0] uppercase tracking-wide">
                    Editorial Typography Hierarchy
                  </h4>
                  <p className="text-[11px] text-[#777] leading-normal">
                    Commanding display headers in Bebas Neue / Syne paired with geometric DM Sans body copy and monospace data strips.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[#0D0D0D] border border-[#222]">
                <div className="w-8 h-8 rounded-lg bg-[#C9A227]/15 flex items-center justify-center flex-shrink-0 text-[#C9A227] font-bold text-xs">
                  03
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#EDE9E0] uppercase tracking-wide">
                    The 8 Core Conversion Modules
                  </h4>
                  <p className="text-[11px] text-[#777] leading-normal">
                    Hero, Live Stats, Bio, Lossless Audio, 300DPI Vault, Stage Plot Rider, Press Quotes, and Direct Contact Lock.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[#0D0D0D] border border-[#222]">
                <div className="w-8 h-8 rounded-lg bg-[#C9A227]/15 flex items-center justify-center flex-shrink-0 text-[#C9A227] font-bold text-xs">
                  04
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#EDE9E0] uppercase tracking-wide">
                    Live Web + Instant Vector Print PDF
                  </h4>
                  <p className="text-[11px] text-[#777] leading-normal">
                    Any change in the EPK studio instantly updates both the live shareable URL and generates a print-ready vector PDF one-sheet.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="gold"
                asChild
                className="bg-[#C9A227] hover:bg-[#d8b030] text-[#050505] font-bold uppercase text-xs tracking-wider h-11 px-6 rounded-xl shadow-lg shadow-[#C9A227]/20"
              >
                <Link href="/templates" className="flex items-center gap-2">
                  <span>Explore Design System Templates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Interactive Token & Quality Spec Card ── */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#080808] border border-[#C9A227]/30 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#222]">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C9A227] font-semibold">
                    Live Token Inspector
                  </span>
                  <h3 className="font-display text-2xl uppercase tracking-wide text-[#EDE9E0]">
                    Design System Palette
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[10px] text-[#22C55E] font-bold uppercase tracking-wider">
                  Taste Score: 99/100
                </span>
              </div>

              {/* Color Swatches Grid */}
              <div className="space-y-2">
                <span className="text-[11px] text-[#777] uppercase tracking-wider font-semibold">
                  Core Color Architecture
                </span>
                <div className="grid grid-cols-5 gap-2">
                  <div className="p-2.5 rounded-xl bg-[#080808] border border-[#222] text-center space-y-1">
                    <div className="w-full h-6 rounded bg-[#080808] border border-[#333]" />
                    <p className="text-[9px] font-mono text-[#AAA]">#080808</p>
                    <p className="text-[8px] text-[#666] uppercase">Obsidian</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141414] border border-[#222] text-center space-y-1">
                    <div className="w-full h-6 rounded bg-[#141414] border border-[#333]" />
                    <p className="text-[9px] font-mono text-[#AAA]">#141414</p>
                    <p className="text-[8px] text-[#666] uppercase">Surface</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141414] border border-[#222] text-center space-y-1">
                    <div className="w-full h-6 rounded bg-[#C9A227]" />
                    <p className="text-[9px] font-mono text-[#C9A227]">#C9A227</p>
                    <p className="text-[8px] text-[#C9A227] uppercase">Gold</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141414] border border-[#222] text-center space-y-1">
                    <div className="w-full h-6 rounded bg-[#22C55E]" />
                    <p className="text-[9px] font-mono text-[#22C55E]">#22C55E</p>
                    <p className="text-[8px] text-[#22C55E] uppercase">Verified</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141414] border border-[#222] text-center space-y-1">
                    <div className="w-full h-6 rounded bg-[#EDE9E0]" />
                    <p className="text-[9px] font-mono text-[#DDD]">#EDE9E0</p>
                    <p className="text-[8px] text-[#888] uppercase">Platinum</p>
                  </div>
                </div>
              </div>

              {/* Typography Spec */}
              <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-2">
                <span className="text-[10px] text-[#C9A227] uppercase tracking-wider font-semibold">
                  Typography Pairing Tokens
                </span>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-display text-lg uppercase text-[#EDE9E0]">BEBAS NEUE</span>
                    <p className="text-[10px] text-[#777]">Display / Headlines (Uppercase, 0.05em track)</p>
                  </div>
                  <div className="text-right">
                    <span className="font-sans font-semibold text-sm text-[#EDE9E0]">DM Sans / Inter</span>
                    <p className="text-[10px] text-[#777]">Body &amp; Microcopy (140% line-height)</p>
                  </div>
                </div>
              </div>

              {/* 8-Module Quality Gate Checklist */}
              <div className="space-y-2">
                <span className="text-[11px] text-[#777] uppercase tracking-wider font-semibold">
                  8-Module Automated Quality Checklist
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#BBB]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Hero &amp; High-Res Portrait</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Live Spotify Sync</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>3-Tier Story Bio</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Lossless Track Player</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>300DPI Press Vault</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Tech Rider &amp; Stage Plot</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Press Pull Quotes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Direct Booking &amp; Team Lock</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-[#666]">
                  Guaranteed 100% responsive on all mobile, tablet, and desktop viewports.
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
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

      {/* ── DUAL COLUMN HERO ─────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">

        {/* Ambient glows */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#C9A227]/8 rounded-full blur-[180px] pointer-events-none -translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#C0272D]/6 rounded-full blur-[160px] pointer-events-none translate-x-1/4 translate-y-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center pt-16 lg:pt-8">

            {/* ── LEFT: Copy Column ── */}
            <div className="flex flex-col gap-7">

              {/* Artispreneur pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111] border border-[#C9A227]/35 shadow-md shadow-[#C9A227]/5 w-fit">
                <img src="/artispreneur-logo.png" alt="Artispreneur" className="w-4 h-4 object-contain" />
                <span className="text-[11px] uppercase tracking-widest text-[#C9A227] font-semibold">
                  Powered by Artispreneur
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h1 className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.92] tracking-wide text-[#EDE9E0] uppercase">
                  Get Your
                  <br />
                  <span className="text-[#C9A227]">Music</span>
                  <br />
                  Press Kit.
                </h1>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-[#888] leading-relaxed max-w-md">
                Create high-impact Electronic Press Kits in minutes. AI writes your bio,
                pulls your live stats from Spotify &amp; Apple Music, generates technical riders,
                and delivers stunning PDF one-sheets + shareable hosted pages.
              </p>

              {/* Trust signals row */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#666] uppercase tracking-wider font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                  Free to start
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                  No design skills needed
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                  Ready in 5 minutes
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <Button
                  variant="gold"
                  asChild
                  className="bg-[#C9A227] hover:bg-[#d8b030] text-[#050505] font-bold uppercase text-xs tracking-wider h-12 px-8 shadow-xl shadow-[#C9A227]/20 rounded-xl"
                >
                  <Link href="/builder" className="flex items-center gap-2">
                    <span>Build Your EPK Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-[#2A2A2A] text-[#CCC] hover:border-[#C9A227]/50 hover:text-[#EDE9E0] h-12 px-6 rounded-xl"
                >
                  <a href="#bio-generator" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C9A227]" />
                    <span>Free Bio Generator</span>
                  </a>
                </Button>
              </div>

              {/* Social proof micro-line */}
              <p className="text-[11px] text-[#555]">
                Trusted by independent artists, managers, and labels worldwide.
              </p>
            </div>

            {/* ── RIGHT: Visual Column ── */}
            <div className="relative flex items-center justify-center lg:justify-end">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-[#C9A227]/10 blur-[80px] rounded-3xl pointer-events-none" />

              {/* Floating stat badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -left-4 top-8 z-20 bg-[#0D0D0D] border border-[#C9A227]/30 rounded-xl px-3 py-2 shadow-xl hidden sm:flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-[#C9A227]/20 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#EDE9E0]">3.2M+</p>
                  <p className="text-[9px] text-[#888] uppercase tracking-wider">Global Streams</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute -right-4 bottom-10 z-20 bg-[#0D0D0D] border border-[#22C55E]/30 rounded-xl px-3 py-2 shadow-xl hidden sm:flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-[#22C55E]/15 flex items-center justify-center">
                  <BadgeCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#EDE9E0]">A&R Priority</p>
                  <p className="text-[9px] text-[#888] uppercase tracking-wider">Label Ready</p>
                </div>
              </motion.div>

              {/* EPK mockup image */}
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                className="relative z-10 w-full max-w-lg lg:max-w-none rounded-2xl overflow-hidden border border-[#C9A227]/20 shadow-2xl shadow-[#C9A227]/10"
              >
                {/* Browser chrome bar */}
                <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#111] border-b border-[#222]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/70" />
                  <span className="ml-3 text-[10px] text-[#555] font-mono">artistsepks.com/@kaylanvale</span>
                </div>
                <img
                  src="/epk-hero-mockup.jpg"
                  alt="ArtistEPKs — Music Press Kit Dashboard"
                  className="w-full h-auto block"
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>
      {/* ────────────────────────────────────────────────────────── */}

      {/* ── SECTION 1: WHAT IS AN EPK (DUAL SECTION) ── */}
      <WhatIsAnEPKSection />

      {/* ── SECTION 2: 5 SPECIALIZED EPK TYPES (DUAL SECTION) ── */}
      <EPKTypesSection />

      {/* ── SECTION 3: EPK DESIGN SYSTEM & FRAMEWORK (DUAL SECTION) ── */}
      <EPKDesignSystemSection />

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
