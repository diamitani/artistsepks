"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  CheckCircle2,
  Sliders,
  Filter,
  Disc3,
  Calendar,
  Briefcase,
  Music2,
  Radio,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TemplateItem {
  id: string;
  name: string;
  category: "Major Label" | "Festival Booking" | "Brand Partnership" | "Sync Licensing" | "Single/Album Release" | "DJ & Live Act";
  badge: string;
  tagline: string;
  color: string;
  bgGradient: string;
  description: string;
  highlights: string[];
  idealFor: string;
  templateType: "main" | "booking" | "brand";
}

const TEMPLATES: TemplateItem[] = [
  {
    id: "major-executive-gold",
    name: "Executive Major Label Pitch",
    category: "Major Label",
    badge: "A&R Priority",
    tagline: "Built for A&R scouting, RIAA trajectory, and streaming proofs.",
    color: "#C9A227",
    bgGradient: "from-[#17140B] via-[#0D0D0D] to-[#050505]",
    description:
      "A commanding, gold-accented presentation designed to deliver maximum commercial impact in under 45 seconds. Features verified DSP counters, chart milestones, press highlights, and streaming growth curves.",
    highlights: [
      "Spotify & Apple Music direct player sync",
      "RIAA certification & playlist placement badges",
      "High-converting executive bio summary",
      "Direct manager & attorney contact lockup",
    ],
    idealFor: "Breakout artists pitching to Atlantic, Columbia, Interscope, or major management.",
    templateType: "main",
  },
  {
    id: "festival-booking-deck",
    name: "Festival & Tour Booking Kit",
    category: "Festival Booking",
    badge: "Promoter Magnet",
    tagline: "Complete live performance specs, technical rider, and stage plots.",
    color: "#C0272D",
    bgGradient: "from-[#1A0A0C] via-[#0D0D0D] to-[#050505]",
    description:
      "Engineered for talent buyers, festival promoters, and tour routing. Eliminates email back-and-forth by packaging your channel list, monitor specs, live videos, past tour sellouts, and guarantee fees into one link.",
    highlights: [
      "Interactive 24-channel technical rider builder",
      "Live festival footage video showcase",
      "Three performance package tiers (Club, Festival, Acoustic)",
      "Direct venue hospitality and backline specs",
    ],
    idealFor: "Touring bands, festival acts, solo artists, and booking agencies.",
    templateType: "booking",
  },
  {
    id: "brand-sponsor-dossier",
    name: "Brand & Corporate Sponsor Deck",
    category: "Brand Partnership",
    badge: "High Monetization",
    tagline: "Audience demographics, engagement metrics, and partnership deliverables.",
    color: "#38BDF8",
    bgGradient: "from-[#081520] via-[#0D0D0D] to-[#050505]",
    description:
      "Showcase your cultural influence and demographic reach to corporate sponsors, fashion houses, beverage brands, and gaming studios. Includes Instagram/TikTok engagement rates and past brand activation case studies.",
    highlights: [
      "Audience demographic breakdown (Age, Gender, Top Cities)",
      "Multi-tier sponsorship packages (Bronze, Gold, Title)",
      "Past brand activation case study cards",
      "High-res logo and press photo downloads",
    ],
    idealFor: "Artists pursuing fashion sponsorships, festival brand activations, and lifestyle deals.",
    templateType: "brand",
  },
  {
    id: "sync-licensing-reel",
    name: "Sync & Music Supervision Reel",
    category: "Sync Licensing",
    badge: "Film & TV Ready",
    tagline: "BPM, Key, mood tags, and 1-stop publishing clearance.",
    color: "#A78BFA",
    bgGradient: "from-[#140C20] via-[#0D0D0D] to-[#050505]",
    description:
      "Purpose-built for music supervisors working on Netflix, HBO, video games, and national ad spots. Tags all tracks with tempo, emotional vibes, soundalike references, and instant stem availability.",
    highlights: [
      "BPM, Key, and Mood filter tags for every cue",
      "100% One-Stop clearance confirmation badges",
      "Instrumental & clean TV stem download links",
      "PRO affiliation (ASCAP / BMI / SESAC / PRS) listed",
    ],
    idealFor: "Producers, composers, sync-focused indie artists, and publishers.",
    templateType: "main",
  },
  {
    id: "single-album-rollout",
    name: "Single & Album Rollout Kit",
    category: "Single/Album Release",
    badge: "Campaign Focus",
    tagline: "Pre-save countdown, track-by-track breakdown, and press one-sheet.",
    color: "#22C55E",
    bgGradient: "from-[#08190E] via-[#0D0D0D] to-[#050505]",
    description:
      "Launch your new single or album with high momentum. Gives tastemaker blogs, radio DJs, and playlist editors advance listening links, lyric sheets, liner notes, and official music video premiere links.",
    highlights: [
      "Pre-save & streaming smart links (Spotify, Apple, Tidal)",
      "Track-by-track audio commentary & lyrics",
      "High-res 300DPI album artwork download",
      "Embargoed press release & journalist pitch",
    ],
    idealFor: "Upcoming release campaigns, album premieres, and PR blasts.",
    templateType: "main",
  },
  {
    id: "dj-electronic-live",
    name: "DJ & Electronic Live Act Deck",
    category: "DJ & Live Act",
    badge: "Nightclub / Rave",
    tagline: "Club tech specs (CDJ-3000 / Pioneer), SoundCloud DJ mixes, and residency history.",
    color: "#EC4899",
    bgGradient: "from-[#1C0A15] via-[#0D0D0D] to-[#050505]",
    description:
      "Tailored for DJs, electronic producers, and modular synthesizer live acts. Features embedded SoundCloud DJ sets, Pioneer DJ booth technical rider, past club residencies, and festival headliner billing.",
    highlights: [
      "SoundCloud / Mixcloud continuous mix player",
      "Pioneer CDJ/DJM technical backline specifications",
      "Crowd energy video reels and past club sellouts",
      "International booking agent contact routing",
    ],
    idealFor: "House, Techno, EDM, Bass, and Ambient live electronic performers.",
    templateType: "booking",
  },
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);

  const categories = ["All", "Major Label", "Festival Booking", "Brand Partnership", "Sync Licensing", "Single/Album Release", "DJ & Live Act"];

  const filtered = activeCategory === "All"
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#050505] text-[#EDE9E0] pb-24">
      {/* Header Banner */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#1A1A1A] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#C9A227]/10 blur-[130px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#C9A227]/30 text-xs font-medium text-[#C9A227]">
            <Layers className="w-3.5 h-3.5" />
            <span>Curated EPK Archetypes</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl tracking-wider uppercase text-[#EDE9E0]">
            EPK Templates Engineered For <span className="text-[#C9A227]">Specific Industry Outcomes</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base text-[#A0A0A0] leading-relaxed">
            Choose from purpose-built templates designed for major label signing, festival booking,
            sync licensing, brand deals, or single rollouts.
          </p>

          {/* Category Filter Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all tracking-wider uppercase",
                  activeCategory === cat
                    ? "bg-[#C9A227] text-[#050505] font-bold shadow-lg shadow-[#C9A227]/20"
                    : "bg-[#111] text-[#999] border border-[#2A2A2A] hover:border-[#444] hover:text-[#EDE9E0]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Template Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-[#0D0D0D] border border-[#222] hover:border-[#C9A227]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xl"
            >
              {/* Card Header Preview Area */}
              <div className={cn("p-6 bg-gradient-to-b border-b border-[#1A1A1A] relative", t.bgGradient)}>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border"
                    style={{ color: t.color, borderColor: `${t.color}40`, backgroundColor: `${t.color}15` }}
                  >
                    {t.badge}
                  </span>
                  <span className="text-xs text-[#777] font-medium">{t.category}</span>
                </div>

                <h3 className="font-display text-2xl tracking-wide uppercase text-[#EDE9E0] group-hover:text-white transition-colors">
                  {t.name}
                </h3>
                <p className="text-xs text-[#AAA] mt-1 line-clamp-2">
                  {t.tagline}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-[#888] leading-relaxed">
                    {t.description}
                  </p>

                  <div className="pt-2 border-t border-[#1C1C1C] space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#CCC] block">
                      Key Highlights:
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#999]">
                      {t.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1C1C1C] space-y-3">
                  <p className="text-[11px] text-[#777] italic">
                    <strong className="text-[#AAA] not-italic">Ideal For:</strong> {t.idealFor}
                  </p>

                  <div className="flex items-center gap-2.5">
                    <Button
                      variant="gold"
                      size="sm"
                      asChild
                      className="flex-1 bg-[#C9A227] hover:bg-[#d8b030] text-[#050505] font-bold tracking-wider uppercase text-xs shadow-md"
                    >
                      <Link href={`/builder?template=${t.templateType}`}>
                        <span>Use Template</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTemplate(t)}
                      className="border-[#333] text-[#CCC] hover:border-[#666] hover:text-white"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Preview Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-2xl w-full rounded-2xl bg-[#0F0F0F] border border-[#C9A227]/40 p-6 space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#222]">
                <div>
                  <Badge className="bg-[#C9A227]/20 text-[#C9A227] border-[#C9A227]/30 uppercase text-[10px] tracking-wider mb-1">
                    {selectedTemplate.category}
                  </Badge>
                  <h3 className="font-display text-2xl uppercase tracking-wider text-[#EDE9E0]">
                    {selectedTemplate.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTemplate(null)}
                  className="text-[#888] hover:text-white text-sm p-1 rounded bg-[#181818]"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-4 text-sm text-[#CCC]">
                <p>{selectedTemplate.description}</p>
                <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
                    Included Modules:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#AAA]">
                    {selectedTemplate.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-[#C9A227]">✓</span> {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222]">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTemplate(null)}
                  className="border-[#333]"
                >
                  Cancel
                </Button>
                <Button variant="gold" asChild className="bg-[#C9A227] text-[#050505] font-semibold">
                  <Link href={`/builder?template=${selectedTemplate.templateType}`}>
                    Open in EPK Studio
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
