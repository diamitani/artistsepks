"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Music2,
  FileDown,
  BarChart3,
  Globe,
  Sliders,
  ShieldCheck,
  Disc3,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  Radio,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FEATURES_DEEP_DIVE = [
  {
    icon: Sparkles,
    badge: "AI Intelligence",
    title: "AI Bio & Storytelling Copilot",
    subtitle: "Turn notes, influences, and accolades into press-ready narratives.",
    description:
      "Staring at a blank screen is over. Our Vercel AI SDK-powered agent crafts 3-paragraph industry-standard bios in seconds. Select from four distinct tone profiles: Major Label Executive, Festival Curator, Indie Tastemaker, or Formal Press Release.",
    bullets: [
      "Third-person present tense journalistic formatting",
      "Auto-suggests sharp artist taglines and genre positioning",
      "Highlights career milestones and notable playlist placements",
      "Instant one-click rewriting with customizable length and tone",
    ],
    codeSnippet: `// Tone Engine: Major Label Pitch\n"Kaylan Vale's cinematic alternative R&B has amassed 3M+ global streams, drawing critical acclaim from tastemakers for commanding vocal vulnerability."`,
    accent: "#C9A227",
  },
  {
    icon: Music2,
    badge: "Automated Ingestion",
    title: "Instant Spotify & Apple Music DSP Sync",
    subtitle: "Paste a link. Your entire discography, album artwork, and streaming tracks load instantly.",
    description:
      "Never manually type tracklists or upload compressed MP3s again. Our live DSP pipeline pulls your official releases, cover art, streaming links, and verified monthly listener numbers directly into your EPK.",
    bullets: [
      "Embedded audio playback without leaving the presentation",
      "Zero-compression SoundCloud, Spotify, and Apple Music widgets",
      "Verified stats badges that establish immediate credibility with A&Rs",
      "YouTube official music video carousel embedding",
    ],
    codeSnippet: `Spotify API -> Discography Ingested: 14 Releases\nMonthly Listeners: 68,400 (Verified DSP Data)`,
    accent: "#22C55E",
  },
  {
    icon: BarChart3,
    badge: "DocSend for Music",
    title: "Real-Time Pitch Deck Analytics",
    subtitle: "Know exactly who opened your EPK, how long they stayed, and which tracks they streamed.",
    description:
      "Stop wondering if the festival promoter or label A&R listened to your music. Get granular view metrics, average deck dwell time, track stream count, and asset download timestamps delivered to your dashboard.",
    bullets: [
      "Total views, unique visitors, and average time spent per section",
      "Track play counter: see which songs are being listened to and skipped",
      "Asset download triggers: know when a publicist downloads your 300DPI photos",
      "Password protection & private links with customizable expiry dates",
    ],
    codeSnippet: `View Event: Atlantic A&R Opened /epk/kaylan-vale\nDwell Time: 3m 42s · Track 01 Played (100%) · Photos Downloaded`,
    accent: "#38BDF8",
  },
  {
    icon: Calendar,
    badge: "Live Performance",
    title: "Interactive Tech Rider & Stage Plot",
    subtitle: "The ultimate booking tool for promoters, sound engineers, and venue stage managers.",
    description:
      "Eliminate day-of-show audio disasters. Build a professional 24-channel input list, monitor mix preferences, stage layout diagram, backline equipment requirements, and hospitality rider — all exportable as a clean PDF.",
    bullets: [
      "Channel list generator (Vocal mics, DI boxes, drum lines, synthesizer stereo outs)",
      "Monitor & IEM preferences with lighting cues",
      "Three customizable booking package tiers (Club, Festival, VIP)",
      "Direct venue routing with budget, date, and capacity prompts",
    ],
    codeSnippet: `Stage Plot: Lead Vocal (Shure Wireless) · Synth L/R (Stereo DI) · In-Ear Monitors Mix 1 & 2`,
    accent: "#C0272D",
  },
  {
    icon: FileDown,
    badge: "Media Vault",
    title: "High-Res 300DPI Press Asset Vault",
    subtitle: "Approved photography, vector brandmarks, and one-sheet PDFs in one click.",
    description:
      "Journalists and magazine editors operate under tight print deadlines. Give them frictionless access to high-resolution landscape and portrait photos, transparent vector logos, liner notes, and one-sheet PDF summaries.",
    bullets: [
      "One-click 'Download All Press Assets' ZIP bundle",
      "Lossless 300 DPI photography with photographer credit tags",
      "SVG and PNG transparent vector brandmark assets",
      "Single-page executive One-Sheet PDF export for fast email pitching",
    ],
    codeSnippet: `Press Vault Bundle: 6 High-Res Photos (300 DPI) · Vector Logo SVG · Master Bio PDF`,
    accent: "#F472B6",
  },
  {
    icon: Globe,
    badge: "Enterprise & Scale",
    title: "Custom Vanity Domains & Agency Roster Suite",
    subtitle: "Own your brand URL and manage multiple artists under one centralized team seat.",
    description:
      "Connect your custom domain (e.g. epk.artistname.com) with automated SSL provisioning. Management firms and record labels can manage 5 to 50 artist profiles from a single workspace with role-based team permissions.",
    bullets: [
      "Automated edge SSL provisioning via Vercel infrastructure",
      "Multi-artist roster switcher for management firms and PR agencies",
      "White-label agency export options",
      "Role-based permissions (Viewer, Editor, Admin, Owner)",
    ],
    codeSnippet: `DNS Active: epk.kaylanvale.com -> Edge Verified (SSL 256-bit)\nRoster: 12 Active Artist EPKs`,
    accent: "#A78BFA",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#EDE9E0] pb-24">
      {/* Hero Header */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#1A1A1A] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#C9A227]/10 blur-[130px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#C9A227]/30 text-xs font-medium text-[#C9A227]">
            <Zap className="w-3.5 h-3.5" />
            <span>Platform Infrastructure & Capabilities</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl tracking-wider uppercase text-[#EDE9E0]">
            The Most Advanced <span className="text-[#C9A227]">EPK Engine</span> In Music
          </h1>

          <p className="max-w-2xl mx-auto text-base text-[#A0A0A0] leading-relaxed">
            Everything you need to pitch, book, stream, and monetize. Built on the Vercel AI SDK,
            Supabase Postgres, and Artispreneur music business architecture.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4">
            <Button variant="gold" size="lg" asChild className="bg-[#C9A227] text-[#050505] font-bold uppercase text-xs">
              <Link href="/builder">Launch EPK Studio</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-[#333] text-[#EDE9E0]">
              <a href="/#bio-generator">Free Bio Generator</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-20">
        {FEATURES_DEEP_DIVE.map((f, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={f.title}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                isEven ? "" : "lg:flex-row-reverse"
              }`}
            >
              {/* Text Side (6 cols) */}
              <div className={`lg:col-span-6 space-y-4 ${isEven ? "" : "lg:order-2"}`}>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#141414] border border-[#2A2A2A] text-[11px] font-bold uppercase tracking-wider text-[#C9A227]">
                  <f.icon className="w-3.5 h-3.5" style={{ color: f.accent }} />
                  <span>{f.badge}</span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-[#EDE9E0]">
                  {f.title}
                </h2>

                <p className="text-sm font-medium text-[#C9A227]">
                  {f.subtitle}
                </p>

                <p className="text-sm text-[#A0A0A0] leading-relaxed">
                  {f.description}
                </p>

                <div className="pt-2 space-y-2">
                  {f.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#CCC]">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button variant="outline" size="sm" asChild className="border-[#333] hover:border-[#C9A227]">
                    <Link href="/builder">
                      <span>Try {f.badge} in Studio</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Visual / Code Window Side (6 cols) */}
              <div className={`lg:col-span-6 ${isEven ? "" : "lg:order-1"}`}>
                <div className="rounded-2xl bg-[#0D0D0D] border border-[#222] p-6 shadow-2xl relative overflow-hidden group hover:border-[#C9A227]/40 transition-colors">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1E1E1E]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/60" />
                    </div>
                    <span className="text-[10px] text-[#666] uppercase tracking-wider font-mono">
                      EPK-ENGINE // {f.badge.toUpperCase()}
                    </span>
                  </div>

                  <div className="pt-4 font-mono text-xs text-[#AAA] whitespace-pre-wrap leading-relaxed bg-[#080808] p-4 rounded-xl border border-[#181818]">
                    {f.codeSnippet}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1E1E1E] flex items-center justify-between text-xs text-[#777]">
                    <span>Powered by Artispreneur OS</span>
                    <span className="text-[#22C55E] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> Live System
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-br from-[#181818] via-[#0E0E0E] to-[#050505] border border-[#C9A227]/30 shadow-2xl space-y-6">
          <img
            src="/artispreneur-logo.png"
            alt="Artispreneur"
            className="w-12 h-12 mx-auto object-contain"
          />
          <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider text-[#EDE9E0]">
            Experience The Next Standard in Music EPKs
          </h2>
          <p className="text-sm text-[#A0A0A0] max-w-xl mx-auto">
            Join thousands of artists, managers, and independent labels building luxury press kits that get booked and signed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button variant="gold" size="lg" asChild className="bg-[#C9A227] text-[#050505] font-bold uppercase text-xs h-12 px-8">
              <Link href="/builder">Create Your EPK Free</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-[#333] text-[#EDE9E0] h-12 px-8">
              <Link href="/templates">Explore Templates</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
