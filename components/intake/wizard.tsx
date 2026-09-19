"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  User,
  Music2,
  FileText,
  Share2,
  Sliders,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  Loader2,
  Home,
  Plus,
  Trash2,
  Globe,
  Radio,
  Eye,
  ShieldCheck,
} from "lucide-react";
import type { ArtistProfile, EPKTemplate } from "@/lib/types";
import { PIPELINE_STEPS } from "@/lib/epk-agent-pipeline";

interface Props {
  profile: ArtistProfile;
  onSave: (profile: ArtistProfile) => void;
  onComplete: (profile: ArtistProfile) => void;
}

const PHASES = [
  { id: 0, label: "Identity", icon: User, desc: "Artist name, genre & type tags" },
  { id: 1, label: "Artistry & Story", icon: FileText, desc: "Influences, theme, style & bio" },
  { id: 2, label: "Music & Links", icon: Share2, desc: "Spotify, Apple, YouTube, Suno" },
  { id: 3, label: "Riders & Shows", icon: Sliders, desc: "Tech rider, performances, press" },
  { id: 4, label: "Team & Rep", icon: Music2, desc: "Management, label, booking contacts" },
  { id: 5, label: "AI Compilation", icon: Sparkles, desc: "11-Skill Pipeline Execution" },
];

const ARTIST_TYPES = [
  "Vocalist / Singer",
  "Producer",
  "Songwriter",
  "Emcee / Rapper",
  "Audio Engineer",
  "Instrumentalist",
  "DJ / Performer",
  "Composer",
  "Comedian",
];

const MAIN_GENRES = [
  "Hip-Hop / Rap",
  "Alternative / Indie Pop",
  "R&B / Soul",
  "Electronic / EDM",
  "Pop",
  "Rock / Metal",
  "Acoustic / Folk",
  "Country / Americana",
  "Latin / Reggaeton",
  "Afrobeats / World",
  "Jazz / Classical",
  "Ambient / Cinematic",
];

export function IntakeWizard({ profile, onSave, onComplete }: Props) {
  const [phase, setPhase] = useState(profile.intakePhase || 0);
  const [data, setData] = useState<ArtistProfile>(profile);
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EPKTemplate>("main");
  
  // AI Compilation state
  const [compiling, setCompiling] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [compiledSuccess, setCompiledSuccess] = useState(false);

  const update = (path: string, value: unknown) => {
    setData((prev) => {
      const next = { ...prev };
      const keys = path.split(".");
      let obj: Record<string, unknown> = next as Record<string, unknown>;
      for (let i = 0; i < keys.length - 1; i++) {
        (obj as Record<string, unknown>)[keys[i]] = {
          ...((obj as Record<string, unknown>)[keys[i]] as Record<string, unknown>),
        };
        obj = (obj as Record<string, unknown>)[keys[i]] as Record<string, unknown>;
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const toggleArtistType = (type: string) => {
    const current = data.background.artistTypes || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    update("background.artistTypes", updated);
  };

  const handleSave = () => {
    setSaving(true);
    const updated = { ...data, intakePhase: phase, updatedAt: new Date().toISOString() };
    onSave(updated);
    setData(updated);
    setTimeout(() => setSaving(false), 400);
  };

  const handleNext = () => {
    handleSave();
    if (phase < 5) setPhase(phase + 1);
  };

  const handleRunCompilation = async () => {
    setCompiling(true);
    setActiveStepIndex(0);
    setCompletedSteps([]);
    setCompiledSuccess(false);

    try {
      // Simulate step-by-step progress visualizer through the 11 skills
      for (let i = 0; i < PIPELINE_STEPS.length; i++) {
        setActiveStepIndex(i);
        await new Promise((r) => setTimeout(r, 350));
        setCompletedSteps((prev) => [...prev, PIPELINE_STEPS[i].id]);
      }

      const res = await fetch("/api/epk/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: data, template: selectedTemplate }),
      });

      if (res.ok) {
        const result = await res.json();
        const updated = {
          ...data,
          intakeComplete: true,
          epkSlug: result.epkData.slug,
          epkData: result.epkData,
          updatedAt: new Date().toISOString(),
        };
        setData(updated);
        onSave(updated);
        setCompiledSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompiling(false);
    }
  };

  const handleFinishAndRedirect = () => {
    const updated = { ...data, intakeComplete: true, intakePhase: 5, updatedAt: new Date().toISOString() };
    onSave(updated);
    onComplete(updated);
  };

  const progress = ((phase + 1) / PHASES.length) * 100;

  return (
    <div className="flex flex-col h-full bg-[#050505] text-[#EDE9E0]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#1E1E1E] bg-[#0a0a0a]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-xs text-[#888] hover:text-[#C9A227] transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <span className="text-[#444] text-xs">/</span>
            <span className="text-xs text-[#EDE9E0] font-mono">EPK Intake & Compilation Agent</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-[#333] hover:border-[#555] text-[#AAA] hover:text-white transition-colors"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Draft
            </button>
          </div>
        </div>

        {/* Phase Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PHASES.map((p) => {
            const isActive = phase === p.id;
            const isDone = phase > p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  handleSave();
                  setPhase(p.id);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#C9A227] text-black font-semibold"
                    : isDone
                    ? "bg-[#161616] text-[#C9A227] border border-[#C9A227]/30"
                    : "bg-[#111] text-[#666] border border-[#222]"
                }`}
              >
                <p.icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{p.label}</span>
                {isDone && <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-[#161616] h-1">
        <motion.div
          className="bg-gradient-to-r from-[#C9A227] to-[#E8C840] h-1"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Body / Active Step Form */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* Phase 0: Artist Identity */}
          {phase === 0 && (
            <motion.div
              key="phase-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-[#EDE9E0] uppercase tracking-wide">
                  Artist Identity & Categorization
                </h2>
                <p className="text-xs text-[#888] mt-1">
                  Tell bookers, labels, and DSPs who you are and where you come from.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Artist / Act Name *
                  </label>
                  <input
                    type="text"
                    value={data.background.artistName}
                    onChange={(e) => update("background.artistName", e.target.value)}
                    placeholder="e.g. Luna Sol"
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Stage Name / Alias (If Different)
                  </label>
                  <input
                    type="text"
                    value={data.background.stageName}
                    onChange={(e) => update("background.stageName", e.target.value)}
                    placeholder="e.g. Luna Sol Official"
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Primary Genre *
                  </label>
                  <select
                    value={data.background.genre || ""}
                    onChange={(e) => update("background.genre", e.target.value)}
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  >
                    <option value="">Select Primary Genre</option>
                    {MAIN_GENRES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Year Started / Active Since
                  </label>
                  <input
                    type="text"
                    value={data.background.yearStarted || ""}
                    onChange={(e) => update("background.yearStarted", e.target.value)}
                    placeholder="e.g. 2021"
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Current City / Base
                  </label>
                  <input
                    type="text"
                    value={data.background.currentCity || data.background.location}
                    onChange={(e) => {
                      update("background.currentCity", e.target.value);
                      update("background.location", e.target.value);
                    }}
                    placeholder="e.g. Los Angeles, CA"
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Birth City / Hometown
                  </label>
                  <input
                    type="text"
                    value={data.background.hometown || data.background.birthCity || ""}
                    onChange={(e) => {
                      update("background.hometown", e.target.value);
                      update("background.birthCity", e.target.value);
                    }}
                    placeholder="e.g. Atlanta, GA"
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
              </div>

              {/* Artist Type Multi-Select */}
              <div>
                <label className="text-xs font-mono uppercase text-[#AAA] block mb-2">
                  Artist Roles & Capabilities (Select All That Apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {ARTIST_TYPES.map((type) => {
                    const isSelected = (data.background.artistTypes || []).includes(type);
                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() => toggleArtistType(type)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          isSelected
                            ? "bg-[#C9A227] text-black font-semibold shadow"
                            : "bg-[#141414] text-[#888] border border-[#252525] hover:border-[#444]"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 1: Artistry & Story */}
          {phase === 1 && (
            <motion.div
              key="phase-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-[#EDE9E0] uppercase tracking-wide">
                  Music Theme, Influences & Brand
                </h2>
                <p className="text-xs text-[#888] mt-1">
                  The EPK Agent analyzes your aesthetic to craft high-converting bio narratives.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Musical Influences & Inspirations
                  </label>
                  <input
                    type="text"
                    value={(data.background.influences || []).join(", ")}
                    onChange={(e) =>
                      update(
                        "background.influences",
                        e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    placeholder="e.g. Frank Ocean, The Weeknd, Tame Impala, FKA Twigs"
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Music Theme & Sonic Style
                  </label>
                  <textarea
                    rows={3}
                    value={data.background.musicThemeStyle || data.background.style || ""}
                    onChange={(e) => {
                      update("background.musicThemeStyle", e.target.value);
                      update("background.style", e.target.value);
                    }}
                    placeholder="Describe your sound, atmosphere, vocal style, instrumentation, or lyrical themes..."
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Artist Identity & Brand Statement
                  </label>
                  <textarea
                    rows={2}
                    value={data.background.artistIdentityBrand || ""}
                    onChange={(e) => update("background.artistIdentityBrand", e.target.value)}
                    placeholder="e.g. Luxury futuristic R&B artist merging cinematic soundscapes with high-fashion visuals."
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Existing Bio Draft / Notes (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={data.background.bio || ""}
                    onChange={(e) => update("background.bio", e.target.value)}
                    placeholder="Paste any existing biography, press notes, or leave blank for the EPK Agent to write from scratch..."
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 2: Music & Social Platform Links */}
          {phase === 2 && (
            <motion.div
              key="phase-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-[#EDE9E0] uppercase tracking-wide">
                  Streaming & Social Links
                </h2>
                <p className="text-xs text-[#888] mt-1">
                  The agent scans these links to generate discography tables and social engagement scores.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Spotify Profile or Track Link
                  </label>
                  <input
                    type="text"
                    value={data.epkData?.socialLinks?.spotify || ""}
                    onChange={(e) => update("epkData.socialLinks.spotify", e.target.value)}
                    placeholder="https://open.spotify.com/artist/..."
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Apple Music Artist Link
                  </label>
                  <input
                    type="text"
                    value={data.epkData?.socialLinks?.appleMusic || ""}
                    onChange={(e) => update("epkData.socialLinks.appleMusic", e.target.value)}
                    placeholder="https://music.apple.com/..."
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    SoundCloud Profile
                  </label>
                  <input
                    type="text"
                    value={data.epkData?.socialLinks?.soundcloud || ""}
                    onChange={(e) => update("epkData.socialLinks.soundcloud", e.target.value)}
                    placeholder="https://soundcloud.com/..."
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    YouTube Channel or Music Video
                  </label>
                  <input
                    type="text"
                    value={data.epkData?.socialLinks?.youtube || ""}
                    onChange={(e) => update("epkData.socialLinks.youtube", e.target.value)}
                    placeholder="https://youtube.com/@..."
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Instagram Handle or URL
                  </label>
                  <input
                    type="text"
                    value={data.epkData?.socialLinks?.instagram || ""}
                    onChange={(e) => update("epkData.socialLinks.instagram", e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    TikTok Profile URL
                  </label>
                  <input
                    type="text"
                    value={data.epkData?.socialLinks?.tiktok || ""}
                    onChange={(e) => update("epkData.socialLinks.tiktok", e.target.value)}
                    placeholder="https://tiktok.com/@..."
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Suno / AI Link
                  </label>
                  <input
                    type="text"
                    value={data.epkData?.socialLinks?.suno || ""}
                    onChange={(e) => update("epkData.socialLinks.suno", e.target.value)}
                    placeholder="https://suno.com/@..."
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Pandora / Other DSP
                  </label>
                  <input
                    type="text"
                    value={data.epkData?.socialLinks?.pandora || ""}
                    onChange={(e) => update("epkData.socialLinks.pandora", e.target.value)}
                    placeholder="https://pandora.com/..."
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 3: Riders, Shows & Press */}
          {phase === 3 && (
            <motion.div
              key="phase-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-[#EDE9E0] uppercase tracking-wide">
                  Live History, Riders & Press
                </h2>
                <p className="text-xs text-[#888] mt-1">
                  Critical for festival talent buyers, tour promoters, and press coverage.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Notable Performances & Tours
                  </label>
                  <textarea
                    rows={3}
                    value={data.assets.performanceNotes || ""}
                    onChange={(e) => update("assets.performanceNotes", e.target.value)}
                    placeholder="e.g. Sold out Troubadour (LA), 14-city headline tour, Electric Horizon festival mainstage..."
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Past Collaborations & Credits
                  </label>
                  <input
                    type="text"
                    value={data.assets.collaborationNotes || (data.collaborations || []).join(", ")}
                    onChange={(e) => {
                      update("assets.collaborationNotes", e.target.value);
                      update("collaborations", e.target.value.split(",").map((s) => s.trim()));
                    }}
                    placeholder="e.g. Featured artists, Grammy-winning producers, remixers..."
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Press Articles / Coverage Links
                  </label>
                  <textarea
                    rows={2}
                    value={(data.assets.pressLinks || []).join("\n")}
                    onChange={(e) =>
                      update("assets.pressLinks", e.target.value.split("\n").filter(Boolean))
                    }
                    placeholder="Paste article URLs (one per line)..."
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                      Technical Rider Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={data.assets.technicalRiderNotes || ""}
                      onChange={(e) => update("assets.technicalRiderNotes", e.target.value)}
                      placeholder="e.g. Stereo line-in, 2x wireless handheld mics, stereo IEM feed, PA specs..."
                      className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                      Performance / Hospitality Rider
                    </label>
                    <textarea
                      rows={3}
                      value={data.assets.performanceRiderNotes || ""}
                      onChange={(e) => update("assets.performanceRiderNotes", e.target.value)}
                      placeholder="e.g. Green room, alkaline water, hot post-soundcheck catering for 6..."
                      className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 4: Team, Representation & Contacts */}
          {phase === 4 && (
            <motion.div
              key="phase-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-[#EDE9E0] uppercase tracking-wide">
                  Contact & Representation
                </h2>
                <p className="text-xs text-[#888] mt-1">
                  How bookers, brands, and media partners directly contact you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Booking Contact Email *
                  </label>
                  <input
                    type="email"
                    value={data.contact.email}
                    onChange={(e) => update("contact.email", e.target.value)}
                    placeholder="booking@artistsepks.com"
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Direct Phone Number
                  </label>
                  <input
                    type="tel"
                    value={data.contact.phone}
                    onChange={(e) => update("contact.phone", e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    value={data.contact.managerName}
                    onChange={(e) => update("contact.managerName", e.target.value)}
                    placeholder="e.g. Alex Vance (Atlas Management)"
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Manager Email / Phone
                  </label>
                  <input
                    type="text"
                    value={data.contact.managerContact}
                    onChange={(e) => update("contact.managerContact", e.target.value)}
                    placeholder="alex@atlasmgmt.com"
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Record Label / Distribution
                  </label>
                  <input
                    type="text"
                    value={data.contact.label}
                    onChange={(e) => update("contact.label", e.target.value)}
                    placeholder="e.g. Independent / Empire / Sony"
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#AAA] block mb-1">
                    Official Website
                  </label>
                  <input
                    type="text"
                    value={data.contact.website}
                    onChange={(e) => update("contact.website", e.target.value)}
                    placeholder="https://artistname.com"
                    className="w-full bg-[#111] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
              </div>

              {/* P.R.O. Status */}
              <div className="rounded-xl bg-[#111] border border-[#222] p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase text-[#EDE9E0]">
                    P.R.O. (Performing Rights Organization)
                  </div>
                  <div className="text-[11px] text-[#888]">
                    Ensure royalties and publishing credits are registered.
                  </div>
                </div>
                <select
                  value={data.assets.proOrganization || "ASCAP"}
                  onChange={(e) => {
                    update("assets.hasPro", true);
                    update("assets.proOrganization", e.target.value);
                  }}
                  className="bg-[#181818] border border-[#333] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                >
                  <option value="ASCAP">ASCAP</option>
                  <option value="BMI">BMI</option>
                  <option value="SESAC">SESAC</option>
                  <option value="SOCAN">SOCAN</option>
                  <option value="PRS">PRS for Music</option>
                  <option value="None">None / Independent</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Phase 5: AI Skill Compilation Execution */}
          {phase === 5 && (
            <motion.div
              key="phase-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-[#EDE9E0] uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C9A227]" />
                  EPK Agent Execution Hub
                </h2>
                <p className="text-xs text-[#888] mt-1">
                  Choose your EPK blueprint and run the 11-skill AI compilation engine.
                </p>
              </div>

              {/* Blueprint Selector */}
              <div>
                <label className="text-xs font-mono uppercase text-[#AAA] block mb-2">
                  Select Target EPK Blueprint
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {[
                    { id: "one-sheet", label: "One-Sheeter", desc: "1-Page Fast Pitch" },
                    { id: "main", label: "General EPK", desc: "Flagship Kit" },
                    { id: "booking", label: "Tour / Booking", desc: "Live Show & Riders" },
                    { id: "media", label: "Media / Press", desc: "Editorial & Photos" },
                    { id: "brand", label: "Brand / Sponsor", desc: "Metrics & Demos" },
                  ].map((t) => {
                    const isSelected = selectedTemplate === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTemplate(t.id as EPKTemplate)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          isSelected
                            ? "bg-[#C9A227]/15 border-[#C9A227] text-white"
                            : "bg-[#111] border-[#222] text-[#888] hover:border-[#444]"
                        }`}
                      >
                        <div className={`text-xs font-bold ${isSelected ? "text-[#C9A227]" : "text-[#DDD]"}`}>
                          {t.label}
                        </div>
                        <div className="text-[10px] text-[#777] mt-0.5">{t.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 11 Skills Progress Box */}
              <div className="rounded-xl bg-[#0e0e0e] border border-[#222] p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#AAA] font-bold">
                    EPK SKILL MAP (11-STEP EXECUTION)
                  </div>
                  {compiling && (
                    <div className="flex items-center gap-2 text-xs text-[#C9A227] font-mono">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Compiling...</span>
                    </div>
                  )}
                  {compiledSuccess && (
                    <div className="flex items-center gap-1.5 text-xs text-[#22C55E] font-mono font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ALL 11 SKILLS COMPILED</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {PIPELINE_STEPS.map((s, idx) => {
                    const isRunning = compiling && activeStepIndex === idx;
                    const isDone = completedSteps.includes(s.id) || compiledSuccess;
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                          isRunning
                            ? "bg-[#C9A227]/20 border border-[#C9A227]/50 text-white"
                            : isDone
                            ? "bg-[#121212] text-[#AAA]"
                            : "bg-[#0a0a0a] text-[#555]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#666]">0{idx + 1}</span>
                          <span className={isDone ? "text-[#EDE9E0]" : ""}>{s.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#666] hidden md:inline">{s.desc}</span>
                          {isRunning && <Loader2 className="w-3 h-3 text-[#C9A227] animate-spin" />}
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Compilation Action Button */}
              {!compiledSuccess ? (
                <button
                  type="button"
                  disabled={compiling || !data.background.artistName}
                  onClick={handleRunCompilation}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E8C840] text-black font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition-opacity disabled:opacity-50"
                >
                  {compiling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Executing EPK Agent Pipeline...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Run EPK Agent & Compile Press Kit
                    </>
                  )}
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleFinishAndRedirect}
                    className="flex-1 py-3.5 rounded-xl bg-[#22C55E] text-black font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition-opacity"
                  >
                    <Eye className="w-4 h-4" />
                    Open EPK in Live Builder
                  </button>
                  <Link
                    href="/dashboard"
                    className="px-6 py-3.5 rounded-xl bg-[#181818] border border-[#333] hover:border-[#555] text-[#EDE9E0] font-semibold text-sm text-center transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="p-4 border-t border-[#1E1E1E] bg-[#0a0a0a] flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (phase > 0) setPhase(phase - 1);
          }}
          disabled={phase === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-[#282828] text-[#AAA] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <div className="text-xs font-mono text-[#666]">
          Step {phase + 1} of {PHASES.length}
        </div>

        {phase < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#C9A227] text-black hover:bg-[#E8C840] transition-colors"
          >
            Next
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
