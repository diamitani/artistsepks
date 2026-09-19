"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import {
  User,
  Music2,
  FileText,
  Camera,
  Share2,
  Briefcase,
  DollarSign,
  Save,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
} from "lucide-react";
import type { ArtistProfile, ServiceRate, Release, BrandAsset } from "@/lib/types";
import { EMPTY_PROFILE } from "@/lib/types";

export default function ProfileHubPage() {
  const [activeTab, setActiveTab] = useState<"bio" | "media" | "discography" | "services" | "contact">("bio");
  const [profile, setProfile] = useState<ArtistProfile>(EMPTY_PROFILE);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("artist_profile");
      if (stored) {
        setProfile(JSON.parse(stored));
      } else {
        // Sample default profile
        setProfile({
          ...EMPTY_PROFILE,
          background: {
            ...EMPTY_PROFILE.background,
            artistName: "Luna Sol",
            genre: "Alternative / Indie Pop",
            location: "Los Angeles, CA",
            influences: ["Frank Ocean", "The Weeknd", "Tame Impala"],
            musicThemeStyle: "Atmospheric, cinematic, emotive storytelling with lush synth pads.",
            bio: "Luna Sol is an acclaimed Los Angeles-based visionary synthesizing ambient soundscapes with stadium-ready pop songwriting.",
            shortBio: "Luna Sol is an LA-based recording artist and producer with over 13M+ streams and verified festival draw.",
          },
          contact: {
            ...EMPTY_PROFILE.contact,
            email: "booking@lunasolofficial.com",
            phone: "+1 (555) 019-2834",
            website: "https://lunasolofficial.com",
            managerName: "Atlas Management",
            managerContact: "alex@atlasmgmt.com",
          },
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem("artist_profile", JSON.stringify(profile));
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2500);
    } catch {
      // ignore
    }
  };

  const updateProfile = (updater: (prev: ArtistProfile) => ArtistProfile) => {
    setProfile((prev) => updater(prev));
  };

  return (
    <div className="min-h-screen bg-[#050505] flex text-[#EDE9E0]">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-[#EDE9E0] font-display">
              ARTIST PROFILE HUB
            </h1>
            <p className="text-xs text-[#888] mt-0.5">
              Master repository of your bio narratives, media assets, discography catalogue, rates, and contact info.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedMessage && (
              <span className="flex items-center gap-1.5 text-xs text-[#22C55E] font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved to Profile
              </span>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#C9A227] text-black hover:bg-[#E8C840] transition-colors shadow"
            >
              <Save className="w-3.5 h-3.5" />
              Save Profile
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#222] pb-3 mb-6 overflow-x-auto">
          {[
            { id: "bio", label: "Bio & Narratives", icon: FileText },
            { id: "media", label: "Media & Assets Vault", icon: Camera },
            { id: "discography", label: "Discography & Catalogue", icon: Music2 },
            { id: "services", label: "Services & Rates", icon: DollarSign },
            { id: "contact", label: "Contact & Representation", icon: Briefcase },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[#C9A227]/15 text-[#C9A227] border border-[#C9A227]/30"
                    : "text-[#888] hover:text-[#EDE9E0] hover:bg-[#121212]"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl space-y-6">
          {/* TAB: Bio & Narratives */}
          {activeTab === "bio" && (
            <div className="space-y-6">
              <div className="rounded-xl bg-[#0d0d0d] border border-[#222] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
                  <h3 className="text-sm font-bold uppercase text-[#EDE9E0] font-mono">
                    Official Artist Biographies
                  </h3>
                  <Link
                    href="/builder"
                    className="text-xs text-[#C9A227] flex items-center gap-1 hover:underline font-mono"
                  >
                    <Sparkles className="w-3 h-3" /> Re-generate with AI
                  </Link>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#888] block mb-1">
                    Short Pitch Bio (50 Words / Playlist Curators & Socials)
                  </label>
                  <textarea
                    rows={3}
                    value={profile.background.shortBio || ""}
                    onChange={(e) =>
                      updateProfile((prev) => ({
                        ...prev,
                        background: { ...prev.background, shortBio: e.target.value },
                      }))
                    }
                    className="w-full bg-[#141414] border border-[#282828] focus:border-[#C9A227] rounded-xl p-3 text-xs text-white outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#888] block mb-1">
                    Full Narrative Bio (300 Words / Press, Media, Website)
                  </label>
                  <textarea
                    rows={6}
                    value={profile.background.bio || ""}
                    onChange={(e) =>
                      updateProfile((prev) => ({
                        ...prev,
                        background: { ...prev.background, bio: e.target.value },
                      }))
                    }
                    className="w-full bg-[#141414] border border-[#282828] focus:border-[#C9A227] rounded-xl p-3 text-xs text-white outline-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-[#0d0d0d] border border-[#222] p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase text-[#EDE9E0] font-mono border-b border-[#1f1f1f] pb-3">
                  Aesthetic & Sonic Style
                </h3>
                <div>
                  <label className="text-xs font-mono uppercase text-[#888] block mb-1">
                    Sonic Style & Atmosphere
                  </label>
                  <input
                    type="text"
                    value={profile.background.musicThemeStyle || ""}
                    onChange={(e) =>
                      updateProfile((prev) => ({
                        ...prev,
                        background: { ...prev.background, musicThemeStyle: e.target.value },
                      }))
                    }
                    className="w-full bg-[#141414] border border-[#282828] focus:border-[#C9A227] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: Media & Assets Vault */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div className="rounded-xl bg-[#0d0d0d] border border-[#222] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase text-[#EDE9E0] font-mono">
                      High-Resolution Press Assets (300 DPI)
                    </h3>
                    <p className="text-[11px] text-[#777] mt-0.5">
                      Approved promotional images, logos, and album cover art.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newAsset: BrandAsset = {
                        id: `asset-${Date.now()}`,
                        title: "New Promo Photo",
                        type: "photo",
                        url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80",
                        dimensions: "3840x2160px",
                        dpi: 300,
                        fileSize: "12.4 MB",
                      };
                      updateProfile((prev) => ({
                        ...prev,
                        brandAssets: [...(prev.brandAssets || []), newAsset],
                      }));
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#333] hover:border-[#555] text-xs font-medium text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#C9A227]" /> Add Asset
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(profile.brandAssets && profile.brandAssets.length > 0
                    ? profile.brandAssets
                    : [
                        {
                          id: "a-1",
                          title: "Primary Studio Portrait (300DPI)",
                          type: "photo" as const,
                          url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80",
                          dimensions: "4000x5000px",
                          dpi: 300,
                          fileSize: "16.8 MB",
                        },
                        {
                          id: "a-2",
                          title: "Live Concert Stage Photo",
                          type: "photo" as const,
                          url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80",
                          dimensions: "3840x2160px",
                          dpi: 300,
                          fileSize: "14.2 MB",
                        },
                      ]
                  ).map((asset, i) => (
                    <div
                      key={asset.id || i}
                      className="rounded-xl bg-[#141414] border border-[#282828] overflow-hidden flex flex-col justify-between"
                    >
                      <div className="aspect-video relative bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={asset.url}
                          alt={asset.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#C9A227] border border-white/10">
                          {asset.dpi} DPI
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="text-xs font-semibold text-[#EDE9E0]">{asset.title}</div>
                        <div className="text-[10px] text-[#777] font-mono mt-1 flex items-center justify-between">
                          <span>{asset.dimensions}</span>
                          <span>{asset.fileSize}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Discography & Catalogue */}
          {activeTab === "discography" && (
            <div className="rounded-xl bg-[#0d0d0d] border border-[#222] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
                <h3 className="text-sm font-bold uppercase text-[#EDE9E0] font-mono">
                  Master Release Catalogue
                </h3>
              </div>

              <div className="space-y-3">
                {[
                  { title: "Midnight Horizon", type: "Single", year: "2024", streams: "1.2M+", bpm: "124 BPM" },
                  { title: "Golden Hour Sessions", type: "EP", year: "2023", streams: "3.8M+", bpm: "118 BPM" },
                  { title: "Echoes in the Dark", type: "Album", year: "2022", streams: "8.4M+", bpm: "Multi" },
                ].map((rel, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#141414] border border-[#282828] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#222] flex items-center justify-center text-xs font-mono font-bold text-[#C9A227]">
                        0{idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#EDE9E0]">{rel.title}</div>
                        <div className="text-[10px] text-[#777] font-mono">
                          {rel.type} · {rel.year} · {rel.bpm}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#AAA] px-2.5 py-1 rounded bg-[#1c1c1c] border border-[#333]">
                      {rel.streams} streams
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Services & Rates */}
          {activeTab === "services" && (
            <div className="rounded-xl bg-[#0d0d0d] border border-[#222] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
                <div>
                  <h3 className="text-sm font-bold uppercase text-[#EDE9E0] font-mono">
                    Professional Services & Rate Card
                  </h3>
                  <p className="text-[11px] text-[#777] mt-0.5">
                    Clear pricing for talent bookers, production clients, and brands.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Headline Concert Performance", rate: "$7,500 – $15,000", unit: "per show", desc: "Full 75-minute live band set with synchronized lighting." },
                  { title: "Feature / Vocal Verse", rate: "$2,500", unit: "per song", desc: "Custom vocal verse + chorus harmonies with dry & wet stems." },
                  { title: "Full Track Production", rate: "$3,500", unit: "per track", desc: "Custom instrumental production, arrangement, and mixing." },
                ].map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#141414] border border-[#282828] flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#EDE9E0]">{srv.title}</div>
                      <p className="text-[11px] text-[#888] mt-2 leading-relaxed">{srv.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#222]">
                      <div className="text-sm font-bold text-[#C9A227] font-mono">{srv.rate}</div>
                      <div className="text-[10px] text-[#666] font-mono uppercase">{srv.unit}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Contact & Rep */}
          {activeTab === "contact" && (
            <div className="rounded-xl bg-[#0d0d0d] border border-[#222] p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase text-[#EDE9E0] font-mono border-b border-[#1f1f1f] pb-3">
                Representation & Management Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#888] block mb-1">Booking Email</label>
                  <input
                    type="email"
                    value={profile.contact.email}
                    onChange={(e) =>
                      updateProfile((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, email: e.target.value },
                      }))
                    }
                    className="w-full bg-[#141414] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-[#888] block mb-1">Booking Phone</label>
                  <input
                    type="text"
                    value={profile.contact.phone}
                    onChange={(e) =>
                      updateProfile((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, phone: e.target.value },
                      }))
                    }
                    className="w-full bg-[#141414] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-[#888] block mb-1">Manager Name</label>
                  <input
                    type="text"
                    value={profile.contact.managerName}
                    onChange={(e) =>
                      updateProfile((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, managerName: e.target.value },
                      }))
                    }
                    className="w-full bg-[#141414] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-[#888] block mb-1">Manager Contact Email</label>
                  <input
                    type="text"
                    value={profile.contact.managerContact}
                    onChange={(e) =>
                      updateProfile((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, managerContact: e.target.value },
                      }))
                    }
                    className="w-full bg-[#141414] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
