"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Disc3,
  Building,
  Calendar,
  User,
  Newspaper,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  Sliders,
  Award,
  ChevronRight,
  RefreshCw,
  FileDown,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PersonaEvaluation {
  id: string;
  persona: string;
  role: string;
  avatarIcon: string;
  score: number;
  verdict: string;
  summary: string;
  strengths: string[];
  missingElements: string[];
  actionPlan: string;
}

interface AnalysisResult {
  overallScore: number;
  readinessTier: "A&R Priority" | "Festival Ready" | "Developing Talent" | "Draft Stage";
  summary: string;
  personas: PersonaEvaluation[];
  topRecommendations: string[];
  suggestedTemplate: "main" | "booking" | "brand";
  generatedBioHook?: string;
}

const SAMPLE_ARTISTS = [
  {
    name: "KAYLAN VALE",
    genre: "Alternative R&B / Cinematic Soul",
    listeners: "68,400",
    bio: "Kaylan Vale is a multi-instrumentalist producer and vocalist based in Atlanta, GA. Known for moody atmospheric synths, crisp 808 percussion, and raw vocal vulnerability, Vale has accumulated over 3M global streams with features on Spotify's R&B UK and Soul Lounge playlists.",
    hasPhotos: true,
    hasRider: true,
    hasPress: true,
  },
  {
    name: "NEON MIRAGE",
    genre: "Synthwave / Electronic Live Act",
    listeners: "14,200",
    bio: "A high-octane 2-piece live electronic band fusing analog synthesizers with live drumming and guitar shredding. Currently touring Midwest club circuits.",
    hasPhotos: true,
    hasRider: false,
    hasPress: false,
  },
  {
    name: "MARLOWE GREY",
    genre: "Indie Folk / Singer-Songwriter",
    listeners: "4,800",
    bio: "Fingerstyle acoustic songwriter from Nashville weaving intimate narratives of heartache and Southern landscapes.",
    hasPhotos: false,
    hasRider: false,
    hasPress: false,
  },
];

export default function EPKAnalyzerPage() {
  const [artistName, setArtistName] = useState("KAYLAN VALE");
  const [genre, setGenre] = useState("Alternative R&B / Cinematic Soul");
  const [monthlyListeners, setMonthlyListeners] = useState("68,400");
  const [bio, setBio] = useState(
    "Kaylan Vale is a multi-instrumentalist producer and vocalist based in Atlanta, GA. Known for moody atmospheric synths, crisp 808 percussion, and raw vocal vulnerability, Vale has accumulated over 3M global streams with features on Spotify's R&B UK and Soul Lounge playlists."
  );
  const [hasPhotos, setHasPhotos] = useState(true);
  const [hasRider, setHasRider] = useState(true);
  const [hasPress, setHasPress] = useState(true);

  const [loading, setLoading] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("major_exec");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze-epk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistName,
          genre,
          bio,
          monthlyListeners,
          hasPhotos,
          hasRider,
          hasPress,
        }),
      });
      const data = await res.json();
      setResult(data);
      if (data.personas && data.personas.length > 0) {
        setSelectedPersonaId(data.personas[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sample: (typeof SAMPLE_ARTISTS)[0]) => {
    setArtistName(sample.name);
    setGenre(sample.genre);
    setMonthlyListeners(sample.listeners);
    setBio(sample.bio);
    setHasPhotos(sample.hasPhotos);
    setHasRider(sample.hasRider);
    setHasPress(sample.hasPress);
  };

  const getPersonaIcon = (id: string) => {
    switch (id) {
      case "major_exec":
        return <Disc3 className="w-5 h-5 text-[#C9A227]" />;
      case "indie_label":
        return <Building className="w-5 h-5 text-[#C0272D]" />;
      case "manager_booking":
        return <Calendar className="w-5 h-5 text-[#38BDF8]" />;
      case "artist_creator":
        return <User className="w-5 h-5 text-[#4ADE80]" />;
      case "pr_publicist":
        return <Newspaper className="w-5 h-5 text-[#F472B6]" />;
      case "vc_investor":
        return <TrendingUp className="w-5 h-5 text-[#A78BFA]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#C9A227]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#EDE9E0] pb-24">
      {/* Header Banner */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#1A1A1A] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#C9A227]/10 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#C9A227]/30 text-xs font-medium text-[#C9A227]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Music Industry Executive & Pitch Doctor</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl tracking-wider uppercase text-[#EDE9E0]">
            Analyze Your EPK Through <span className="text-[#C9A227]">6 Industry Lenses</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base text-[#A0A0A0] leading-relaxed">
            See how your press kit grades with **Major Label A&Rs, Indie Imprints, Festival Booking Agents, Working Artists, PR Publicists, and Music Tech Investors**.
          </p>

          {/* Sample quick loader */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-[#777] uppercase tracking-wider font-semibold">
              Try Sample Artist:
            </span>
            {SAMPLE_ARTISTS.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => loadSample(s)}
                className="px-2.5 py-1 rounded-md text-xs bg-[#111] hover:bg-[#1C1C1C] border border-[#2A2A2A] hover:border-[#C9A227]/40 text-[#CCC] transition-colors"
              >
                {s.name} ({s.genre.split("/")[0]})
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#222] space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#C9A227]" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#EDE9E0]">
                    Artist Profile Data
                  </h3>
                </div>
                <span className="text-[11px] text-[#777]">Self-Audit Input</span>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs text-[#888] uppercase tracking-wider mb-1 font-medium">
                    Artist / Band Name
                  </label>
                  <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] focus:border-[#C9A227] text-[#EDE9E0] focus:outline-none text-sm"
                    placeholder="e.g. SZA, Kaylan Vale, The Midnight"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#888] uppercase tracking-wider mb-1 font-medium">
                    Primary Genre & Style
                  </label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] focus:border-[#C9A227] text-[#EDE9E0] focus:outline-none text-sm"
                    placeholder="e.g. Alternative R&B, Tech House, Indie Rock"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#888] uppercase tracking-wider mb-1 font-medium">
                    Monthly Listeners / Stream Stats
                  </label>
                  <input
                    type="text"
                    value={monthlyListeners}
                    onChange={(e) => setMonthlyListeners(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] focus:border-[#C9A227] text-[#EDE9E0] focus:outline-none text-sm"
                    placeholder="e.g. 45,000 or 1.2M"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#888] uppercase tracking-wider mb-1 font-medium">
                    Current Bio / Pitch Story
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] focus:border-[#C9A227] text-[#EDE9E0] focus:outline-none text-sm resize-none"
                    placeholder="Paste your current artist bio or press summary..."
                  />
                </div>

                {/* Asset Checkboxes */}
                <div className="pt-2 space-y-2 border-t border-[#1C1C1C]">
                  <p className="text-xs text-[#888] uppercase tracking-wider font-semibold">
                    Current EPK Assets Included:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <label className="flex items-center gap-2 text-xs text-[#AAA] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasPhotos}
                        onChange={(e) => setHasPhotos(e.target.checked)}
                        className="rounded border-[#333] text-[#C9A227] focus:ring-[#C9A227]"
                      />
                      <span>Approved 300DPI High-Res Press Photos</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#AAA] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasRider}
                        onChange={(e) => setHasRider(e.target.checked)}
                        className="rounded border-[#333] text-[#C9A227] focus:ring-[#C9A227]"
                      />
                      <span>Technical Stage Plot & Hospitality Rider</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#AAA] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasPress}
                        onChange={(e) => setHasPress(e.target.checked)}
                        className="rounded border-[#333] text-[#C9A227] focus:ring-[#C9A227]"
                      />
                      <span>Verified Press Quotes & Publication Links</span>
                    </label>
                  </div>
                </div>

                <Button
                  variant="gold"
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full bg-[#C9A227] hover:bg-[#d8b030] text-[#050505] font-bold tracking-wider uppercase text-xs h-11 shadow-lg shadow-[#C9A227]/20"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Running Multi-Persona Analysis...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Generate Industry EPK Audit
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Platform Trust Box */}
            <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] flex items-center gap-3">
              <img
                src="/artispreneur-logo.png"
                alt="Artispreneur"
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <div className="text-xs text-[#888]">
                <span className="text-[#EDE9E0] font-semibold block">
                  Artispreneur Industry Standards
                </span>
                Audited against actual A&R criteria from Universal, Warner, Sony & Live Nation.
              </div>
            </div>
          </div>

          {/* Right Results Column (7 cols) */}
          <div className="lg:col-span-7">
            {loading ? (
              <div className="h-[520px] rounded-2xl bg-[#0D0D0D] border border-[#222] flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full border-2 border-[#C9A227] border-t-transparent animate-spin flex items-center justify-center">
                  <Disc3 className="w-6 h-6 text-[#C9A227]" />
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wider text-[#EDE9E0]">
                  Analyzing Against 6 Industry Personas...
                </h3>
                <p className="text-sm text-[#888] max-w-md">
                  Simulating A&R signing thresholds, promoter booking viability, sync licensing readiness, and press kit completeness.
                </p>
              </div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Score Header Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#141414] to-[#0A0A0A] border border-[#C9A227]/30 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#222]">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#C9A227] font-semibold">
                        EPK Industry Readiness Score
                      </span>
                      <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-[#EDE9E0]">
                        {artistName || "Artist Profile"}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-3xl font-display text-[#C9A227]">
                          {result.overallScore}
                        </span>
                        <span className="text-sm text-[#777]"> / 100</span>
                      </div>
                      <Badge
                        className={cn(
                          "uppercase tracking-wider text-xs px-3 py-1",
                          result.overallScore >= 85
                            ? "bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40"
                            : result.overallScore >= 70
                            ? "bg-[#C9A227]/20 text-[#C9A227] border-[#C9A227]/40"
                            : "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40"
                        )}
                      >
                        {result.readinessTier}
                      </Badge>
                    </div>
                  </div>

                  <p className="pt-4 text-sm text-[#CCC] leading-relaxed">
                    {result.summary}
                  </p>

                  {result.generatedBioHook && (
                    <div className="mt-4 p-3.5 rounded-lg bg-[#111] border border-[#2A2A2A] text-xs text-[#AAA] italic">
                      <span className="text-[#C9A227] not-italic font-semibold block mb-1">
                        AI Recommended Executive Pitch Hook:
                      </span>
                      &ldquo;{result.generatedBioHook}&rdquo;
                    </div>
                  )}
                </div>

                {/* Persona Selector Tabs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                      Persona Breakdowns (Click to Inspect)
                    </span>
                    <span className="text-[11px] text-[#C9A227]">6 Stakeholder Perspectives</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {result.personas.map((p) => {
                      const isSelected = selectedPersonaId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPersonaId(p.id)}
                          className={cn(
                            "p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24",
                            isSelected
                              ? "bg-[#181818] border-[#C9A227] shadow-lg shadow-[#C9A227]/10"
                              : "bg-[#0D0D0D] border-[#222] hover:border-[#444]"
                          )}
                        >
                          <div className="flex items-center justify-between w-full">
                            {getPersonaIcon(p.id)}
                            <span className="text-xs font-bold font-display text-[#EDE9E0]">
                              {p.score}%
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-[#EDE9E0] line-clamp-1">
                              {p.persona}
                            </p>
                            <p className="text-[10px] text-[#777] line-clamp-1">{p.verdict}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Persona Deep Dive Card */}
                {(() => {
                  const selected = result.personas.find((p) => p.id === selectedPersonaId);
                  if (!selected) return null;
                  return (
                    <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#222] space-y-4">
                      <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#1C1C1C]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#181818] border border-[#333] flex items-center justify-center">
                            {getPersonaIcon(selected.id)}
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-[#EDE9E0]">
                              {selected.persona}
                            </h4>
                            <p className="text-xs text-[#888]">{selected.role}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs border-[#C9A227]/40 text-[#C9A227]">
                          Verdict: {selected.verdict}
                        </Badge>
                      </div>

                      <p className="text-sm text-[#BBB] leading-relaxed">
                        {selected.summary}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {/* Strengths */}
                        <div className="p-3.5 rounded-xl bg-[#121212] border border-[#1E1E1E] space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#22C55E]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>What Works</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-[#999]">
                            {selected.strengths.map((s, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-[#22C55E] mt-0.5">•</span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Missing */}
                        <div className="p-3.5 rounded-xl bg-[#121212] border border-[#1E1E1E] space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#EF4444]">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Critical Gaps</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-[#999]">
                            {selected.missingElements.map((m, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-[#EF4444] mt-0.5">•</span>
                                <span>{m}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action Plan */}
                      <div className="p-3.5 rounded-xl bg-[#C9A227]/5 border border-[#C9A227]/20 flex items-start gap-3">
                        <Zap className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <span className="font-semibold text-[#C9A227] block mb-0.5">
                            Recommended Action:
                          </span>
                          <span className="text-[#CCC]">{selected.actionPlan}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Studio CTA Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#181818] to-[#101010] border border-[#C9A227]/30">
                  <div>
                    <h4 className="text-sm font-semibold text-[#EDE9E0]">
                      Ready to upgrade this EPK into an A&R magnet?
                    </h4>
                    <p className="text-xs text-[#888]">
                      Apply these insights automatically inside the EPK Studio Builder.
                    </p>
                  </div>

                  <Button
                    variant="gold"
                    size="lg"
                    asChild
                    className="bg-[#C9A227] text-[#050505] font-bold uppercase tracking-wider text-xs whitespace-nowrap"
                  >
                    <Link href={`/builder?artist=${encodeURIComponent(artistName)}&genre=${encodeURIComponent(genre)}`}>
                      <span>Open in EPK Studio</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="h-[520px] rounded-2xl bg-[#0D0D0D] border border-[#222] flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#141414] border border-[#2A2A2A] flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-[#C9A227]" />
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wider text-[#EDE9E0]">
                  Ready for Industry Audit
                </h3>
                <p className="text-sm text-[#888] max-w-md">
                  Enter your artist details or select one of our pre-filled demo profiles on the left, then click <strong>Generate Industry EPK Audit</strong>.
                </p>
                <Button
                  variant="outline"
                  onClick={handleAnalyze}
                  className="border-[#C9A227]/40 text-[#EDE9E0] hover:border-[#C9A227] hover:bg-[#C9A227]/10"
                >
                  Run Demo Audit on Kaylan Vale
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
