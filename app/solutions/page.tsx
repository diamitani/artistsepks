"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Briefcase,
  Building,
  Newspaper,
  Calendar,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Disc3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SOLUTIONS = [
  {
    id: "artists",
    icon: User,
    persona: "For Independent Artists & Producers",
    tagline: "Own your presentation. Stop sending messy Linktree links.",
    description:
      "Your music sounds world-class — your press kit should match. Build a breathtaking, mobile-optimized EPK with integrated streaming, verified stats, and auto-generated bio stories in under five minutes.",
    benefits: [
      "AI bio generator translates your origin story into industry-standard copy",
      "Embedded Spotify, Apple Music, and SoundCloud without compression",
      "Direct booking inquiry form routing straight to your phone or manager",
      "Interactive social media growth counters with verified badges",
    ],
    cta: "Build Artist EPK Free",
    link: "/builder?template=main",
    accent: "#C9A227",
  },
  {
    id: "managers",
    icon: Briefcase,
    persona: "For Artist Managers & Management Firms",
    tagline: "Close tour dates, festival slots, and brand sponsorships faster.",
    description:
      "Arm your roster with high-impact pitch decks that festival promoters and corporate sponsors love. Send private DocSend-style links with view analytics to track promoter interest in real time.",
    benefits: [
      "Multi-artist roster workspace: manage 5-20 acts under one login",
      "Real-time analytics: know when a promoter opens your deck and plays your tracks",
      "Technical stage plot and hospitality rider PDF exports for tour production",
      "Custom vanity domains (e.g. epk.artistname.com)",
    ],
    cta: "Manage Your Roster",
    link: "/builder?template=booking",
    accent: "#38BDF8",
  },
  {
    id: "labels",
    icon: Building,
    persona: "For Record Labels & Boutique Imprints",
    tagline: "Standardize release rollouts and maximize sync licensing revenue.",
    description:
      "Equip every release campaign with a unified, high-converting digital press kit. Highlight master/publishing split clearance, BPM/Key metadata for music supervisors, and retail distribution links.",
    benefits: [
      "Sync licensing reels with 1-stop clearance confirmation and stem downloads",
      "Single and album release rollout kits with pre-save links and track commentaries",
      "Centralized asset management for 300DPI cover art and press releases",
      "White-label agency export options",
    ],
    cta: "Explore Label Suite",
    link: "/pricing",
    accent: "#C0272D",
  },
  {
    id: "pr",
    icon: Newspaper,
    persona: "For Music PR Agencies & Publicists",
    tagline: "Give music journalists the frictionless high-res assets they demand.",
    description:
      "Journalists and editors archive pitches with missing assets. ArtistEPKs gives media outlets instant access to approved 300DPI photography, embargoed pre-release streaming, and one-sheet PDF summaries.",
    benefits: [
      "One-click 'Download All Press Assets' ZIP bundle for editors",
      "Embargo mode & password-protected private listening links",
      "Publication quote highlights with verified editorial links",
      "Single-page executive One-Sheet PDF generator",
    ],
    cta: "Publicist Tools",
    link: "/builder?template=main",
    accent: "#F472B6",
  },
  {
    id: "festivals",
    icon: Calendar,
    persona: "For Talent Buyers & Festival Promoters",
    tagline: "Evaluate talent, crowd draw, and technical requirements in 30 seconds.",
    description:
      "Cut through the inbox clutter. Review artist live performance videos, past venue sellout history, 24-channel input lists, and performance fee tiers at a glance.",
    benefits: [
      "Standardized, clean presentation that saves hours of vetting time",
      "Clear live setup requirements before issuing contract offers",
      "Verified streaming numbers from Spotify and YouTube",
      "Direct one-click promoter inquiries",
    ],
    cta: "View Booking Deck",
    link: "/templates",
    accent: "#22C55E",
  },
  {
    id: "investors",
    icon: TrendingUp,
    persona: "For Music Tech Investors & VC Funds",
    tagline: "The Operating System bridging music creator tools and enterprise SaaS.",
    description:
      "ArtistEPKs captures high-margin software subscriptions powered by a high-velocity product-led growth (PLG) viral loop: every public artist EPK promotes the platform to fans, peers, and industry executives.",
    benefits: [
      "Vast TAM spanning 12M+ active global musical artists and 100K+ management agencies",
      "Strong unit economics with low CAC driven by public EPK footer watermarks",
      "Centralized artist data layer unlocking financialization, sync, and ticketing integrations",
      "Backed by the Artispreneur entrepreneurship framework and ecosystem",
    ],
    cta: "Partner With Us",
    link: "/analyzer",
    accent: "#A78BFA",
  },
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#EDE9E0] pb-24">
      {/* Hero Header */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#1A1A1A] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#C9A227]/10 blur-[130px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#C9A227]/30 text-xs font-medium text-[#C9A227]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tailored Industry Workflows</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl tracking-wider uppercase text-[#EDE9E0]">
            Solutions Built For Every <span className="text-[#C9A227]">Music Stakeholder</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base text-[#A0A0A0] leading-relaxed">
            Whether you&apos;re a solo indie artist, a multi-act management firm, a record label, or an investor,
            ArtistEPKs elevates your workflow.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SOLUTIONS.map((s) => (
            <motion.div
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-7 rounded-2xl bg-[#0D0D0D] border border-[#222] hover:border-[#C9A227]/40 transition-all duration-300 flex flex-col justify-between space-y-6 group shadow-xl"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#141414] border border-[#282828] flex items-center justify-center group-hover:border-[#C9A227]/50 transition-colors">
                  <s.icon className="w-6 h-6" style={{ color: s.accent }} />
                </div>

                <div>
                  <h3 className="font-display text-2xl uppercase tracking-wide text-[#EDE9E0]">
                    {s.persona}
                  </h3>
                  <p className="text-xs text-[#C9A227] font-medium mt-1">
                    {s.tagline}
                  </p>
                </div>

                <p className="text-xs text-[#888] leading-relaxed">
                  {s.description}
                </p>

                <div className="pt-2 border-t border-[#1C1C1C] space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#CCC] block">
                    Core Capabilities:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#999]">
                    {s.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1C1C1C]">
                <Button
                  variant="gold"
                  size="sm"
                  asChild
                  className="w-full bg-[#C9A227] hover:bg-[#d8b030] text-[#050505] font-bold tracking-wider uppercase text-xs shadow-md"
                >
                  <Link href={s.link} className="flex items-center justify-center gap-1.5">
                    <span>{s.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
