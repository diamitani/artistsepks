"use client";

import { motion } from "framer-motion";
import type { EPKData } from "@/lib/types";
import {
  Music2,
  Mail,
  Phone,
  Globe,
  Radio,
  ExternalLink,
  Flame,
  Award,
  Sparkles,
  Play,
  CheckCircle2,
} from "lucide-react";

interface Props {
  data: EPKData;
  accentColor?: string;
  isPdfMode?: boolean;
}

export function OneSheetTemplate({ data, accentColor = "#C9A227", isPdfMode = false }: Props) {
  const topReleases = (data.releases || []).slice(0, 3);
  const bio = data.shortBio || data.bio || "Genre-defying independent recording artist and producer.";

  return (
    <div
      className="w-full max-w-4xl mx-auto bg-[#050505] text-[#EDE9E0] border border-[#222] rounded-2xl overflow-hidden shadow-2xl font-sans"
      style={{
        boxShadow: `0 0 50px rgba(0,0,0,0.8), 0 0 30px ${accentColor}15`,
      }}
    >
      {/* Top Banner / One-Sheet Header */}
      <div
        className="px-6 py-4 flex items-center justify-between border-b border-[#222]"
        style={{
          background: `linear-gradient(90deg, ${accentColor}20, transparent)`,
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold"
            style={{ background: `${accentColor}30`, color: accentColor, border: `1px solid ${accentColor}50` }}
          >
            OFFICIAL ONE-SHEET
          </span>
          <span className="text-xs text-[#888] font-mono">
            {data.genre || "Alternative"} · {data.currentCity || data.hometown || "Global"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: accentColor }}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>VERIFIED ARTISPRENEUR EPK</span>
        </div>
      </div>

      {/* Main Grid: Hero + Core Story */}
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Portrait & Key Details (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-[#333] group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.heroImageUrl || data.profileImageUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80"}
              alt={data.artistName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-3 left-3 right-3">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/80 text-white border border-white/10">
                PRO: {data.pro || "ASCAP"} · Est. {data.yearStarted || "2020"}
              </span>
            </div>
          </div>

          {/* Quick Contact Box */}
          <div className="rounded-xl border border-[#222] bg-[#0c0c0c] p-4 flex flex-col gap-2.5 text-xs">
            <h4 className="text-[10px] uppercase font-mono tracking-wider text-[#777] font-semibold">
              DIRECT BOOKING & MANAGEMENT
            </h4>
            {data.bookingEmail && (
              <a
                href={`mailto:${data.bookingEmail}`}
                className="flex items-center gap-2 text-[#EDE9E0] hover:text-[#C9A227] transition-colors truncate"
              >
                <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                <span className="truncate">{data.bookingEmail}</span>
              </a>
            )}
            {data.bookingPhone && (
              <div className="flex items-center gap-2 text-[#AAA]">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                <span>{data.bookingPhone}</span>
              </div>
            )}
            {data.website && (
              <a
                href={data.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#AAA] hover:text-[#EDE9E0] transition-colors truncate"
              >
                <Globe className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                <span className="truncate">{data.website.replace(/^https?:\/\//, "")}</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Name, Bio, Stats, Top Music, Press (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#EDE9E0]">
                {data.artistName || "Artist Name"}
              </h1>
            </div>
            <p className="text-sm font-medium tracking-wide mb-4" style={{ color: accentColor }}>
              {data.artistTagline || `${data.genre || "Alternative"} Pioneer · Vocalist & Producer`}
            </p>

            {/* Elevator Pitch Bio */}
            <div className="rounded-xl bg-[#0e0e0e] border border-[#222] p-4 mb-4">
              <p className="text-xs md:text-sm text-[#DDD] leading-relaxed">
                {bio}
              </p>
            </div>

            {/* Stat Strip */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-lg bg-[#111] border border-[#222] p-2.5 text-center">
                <div className="text-[10px] font-mono text-[#888] uppercase">Listeners</div>
                <div className="text-base md:text-lg font-bold text-[#EDE9E0] font-mono">
                  {data.stats.spotifyListeners || "140K+"}
                </div>
              </div>
              <div className="rounded-lg bg-[#111] border border-[#222] p-2.5 text-center">
                <div className="text-[10px] font-mono text-[#888] uppercase">Streams</div>
                <div className="text-base md:text-lg font-bold text-[#EDE9E0] font-mono">
                  {data.stats.totalStreams || "13M+"}
                </div>
              </div>
              <div className="rounded-lg bg-[#111] border border-[#222] p-2.5 text-center" style={{ borderColor: `${accentColor}30` }}>
                <div className="text-[10px] font-mono uppercase" style={{ color: accentColor }}>Engagement</div>
                <div className="text-base md:text-lg font-bold font-mono" style={{ color: accentColor }}>
                  {data.engagementGrade || "A+"} ({data.engagementScore || 92}%)
                </div>
              </div>
            </div>

            {/* Focus Discography (Top 3) */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-mono uppercase tracking-wider text-[#888] flex items-center gap-1.5">
                  <Music2 className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  TOP DISCOGRAPHY HIGHLIGHTS
                </h3>
              </div>
              <div className="space-y-2">
                {topReleases.map((rel, idx) => (
                  <div
                    key={rel.id || idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#0d0d0d] border border-[#222] hover:border-[#333] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-7 h-7 rounded bg-[#181818] flex items-center justify-center text-xs font-mono font-bold"
                        style={{ color: accentColor }}
                      >
                        0{idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#EDE9E0] truncate">
                          {rel.title}
                        </div>
                        <div className="text-[10px] text-[#777] font-mono">
                          {rel.type} · {rel.year} {rel.bpm ? `· ${rel.bpm} BPM` : ""}
                        </div>
                      </div>
                    </div>
                    {rel.streams && (
                      <span className="text-[10px] font-mono text-[#AAA] px-2 py-0.5 rounded bg-[#141414] border border-[#282828]">
                        {rel.streams}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Press Pull Quote */}
            {data.pressQuotes && data.pressQuotes.length > 0 && (
              <div className="rounded-xl bg-gradient-to-r from-[#121212] to-[#0a0a0a] border-l-2 p-3 text-xs" style={{ borderColor: accentColor }}>
                <p className="italic text-[#CCC] line-clamp-2">
                  {data.pressQuotes[0].quote}
                </p>
                <div className="text-[10px] font-mono text-[#888] mt-1 font-semibold">
                  — {data.pressQuotes[0].publication}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer Attribution */}
      <div className="px-6 py-3 bg-[#080808] border-t border-[#1a1a1a] flex items-center justify-between text-[10px] text-[#666] font-mono">
        <span>ELECTRONIC PRESS KIT · CONFIDENTIAL TALENT ONE-SHEET</span>
        <span>POWERED BY ARTISPRENEUR</span>
      </div>
    </div>
  );
}
