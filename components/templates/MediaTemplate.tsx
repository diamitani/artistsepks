"use client";

import { motion } from "framer-motion";
import type { EPKData } from "@/lib/types";
import {
  FileText,
  Download,
  Image as ImageIcon,
  ExternalLink,
  Mail,
  Award,
  Sparkles,
  Music2,
  CheckCircle2,
  Camera,
} from "lucide-react";

interface Props {
  data: EPKData;
  accentColor?: string;
  isPdfMode?: boolean;
}

export function MediaTemplate({ data, accentColor = "#C9A227", isPdfMode = false }: Props) {
  const photos = data.pressPhotos || [
    {
      id: "p-1",
      title: "Official Studio Portrait (300DPI)",
      type: "photo" as const,
      url: data.heroImageUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80",
      dimensions: "4000x5000px",
      dpi: 300,
      fileSize: "18.4 MB",
    },
    {
      id: "p-2",
      title: "Live Festival Headline Shot",
      type: "photo" as const,
      url: data.profileImageUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80",
      dimensions: "3840x2160px",
      dpi: 300,
      fileSize: "14.2 MB",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#080808] text-[#EDE9E0] font-sans rounded-2xl overflow-hidden border border-[#222] shadow-2xl">
      {/* Top Editorial Ribbon */}
      <div className="bg-[#121212] border-b border-[#222] px-6 py-3 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="text-[#AAA] uppercase tracking-wider">PRESS & MEDIA KIT · EDITORIAL VAULT</span>
        </div>
        <div className="text-[#888]">
          PRESS READY (300DPI ASSETS INCLUDED)
        </div>
      </div>

      {/* Hero Cover */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.heroImageUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80"}
          alt={data.artistName}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest font-bold"
                style={{ background: `${accentColor}25`, color: accentColor, border: `1px solid ${accentColor}40` }}
              >
                {data.genre || "Alternative"} · {data.currentCity || "Artist"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
              {data.artistName || "Artist Name"}
            </h1>
            <p className="text-sm md:text-base text-[#BBB] mt-1">
              {data.artistTagline || "Recording Artist, Producer & Composer"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${data.bookingEmail || "press@artistsepks.com"}`}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-[#1a1a1a] hover:bg-[#252525] text-white border border-[#333] transition-colors flex items-center gap-2"
            >
              <Mail className="w-3.5 h-3.5" style={{ color: accentColor }} />
              Press Inquiries
            </a>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 md:p-10 space-y-10">
        {/* Triple-Tier Bios */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-2">
            <FileText className="w-4 h-4" style={{ color: accentColor }} />
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#AAA] font-bold">
              APPROVED EDITORIAL BIOGRAPHY TIERS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 50-word elevator bio */}
            <div className="p-4 rounded-xl bg-[#111] border border-[#222] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#777] uppercase font-semibold">Short Bio (50 Words / Social & Playlists)</span>
                <p className="text-xs text-[#DDD] mt-2 leading-relaxed">
                  {data.shortBio || data.bio?.slice(0, 220) || "Genre-defying independent recording artist and producer."}
                </p>
              </div>
            </div>

            {/* Full narrative bio (Span 2) */}
            <div className="md:col-span-2 p-5 rounded-xl bg-[#111] border border-[#222]">
              <span className="text-[10px] font-mono text-[#777] uppercase font-semibold">Full Press Narrative (Feature Articles & Interviews)</span>
              <div className="text-xs md:text-sm text-[#CCC] mt-2 leading-relaxed space-y-3 whitespace-pre-line">
                {data.longBio || data.bio}
              </div>
            </div>
          </div>
        </section>

        {/* Press Quotes & Accolades */}
        {data.pressQuotes && data.pressQuotes.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-2">
              <Award className="w-4 h-4" style={{ color: accentColor }} />
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#AAA] font-bold">
                CRITICAL ACCLAIM & AS SEEN IN
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.pressQuotes.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#0f0f0f] border border-[#222] flex flex-col justify-between"
                >
                  <p className="text-xs italic text-[#DDD] leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#1e1e1e] flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-[#EDE9E0]" style={{ color: accentColor }}>
                      {item.publication}
                    </span>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#666] hover:text-white"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 300DPI Press Vault / Media Downloads */}
        <section>
          <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-2">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" style={{ color: accentColor }} />
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#AAA] font-bold">
                300 DPI HI-RES PRESS PHOTO VAULT
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#888]">APPROVED FOR PRINT & DIGITAL PUBLICATION</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((item) => (
              <div
                key={item.id}
                className="rounded-xl bg-[#111] border border-[#222] overflow-hidden group flex flex-col justify-between"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#EDE9E0] border border-white/10">
                    {item.dpi} DPI
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs font-semibold text-[#EDE9E0] truncate">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-[#777] font-mono mt-0.5 flex items-center justify-between">
                    <span>{item.dimensions}</span>
                    <span>{item.fileSize}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact & Media Rep */}
        <section className="rounded-xl bg-[#0c0c0c] border border-[#222] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold uppercase text-[#EDE9E0] font-mono">
              PRESS REVIEWS & INTERVIEW SCHEDULING
            </h3>
            <p className="text-xs text-[#888] mt-1">
              For promo links, review files, interview availability, and hi-res ZIP packages.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <a
              href={`mailto:${data.bookingEmail || "press@artistsepks.com"}`}
              className="px-4 py-2 rounded-xl text-black font-semibold tracking-wide transition-opacity"
              style={{ background: accentColor }}
            >
              Contact Press Team
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="bg-[#050505] border-t border-[#1a1a1a] px-6 py-3 flex items-center justify-between text-[10px] text-[#666] font-mono">
        <span>PRESS KIT · EDITORIAL CLEARANCE & EMBARGO RELEASE</span>
        <span>POWERED BY ARTISPRENEUR</span>
      </div>
    </div>
  );
}
