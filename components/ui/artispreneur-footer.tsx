"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Heart, Radio, Disc3, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ArtispreneurFooter() {
  return (
    <footer className="border-t border-[#2A2A2A] bg-[#070707] text-[#EDE9E0] relative overflow-hidden pt-16 pb-12">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#C9A227]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1F1F1F]">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#141414] p-1.5 border border-[#C9A227]/40 flex items-center justify-center shadow-lg">
                <img
                  src="/artispreneur-logo.png"
                  alt="Artispreneur"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xl tracking-[0.14em] text-[#EDE9E0] uppercase">
                    Artists
                  </span>
                  <span className="font-display text-xl tracking-[0.14em] text-[#C9A227] uppercase">
                    EPKs
                  </span>
                </div>
                <span className="text-[10px] text-[#888] tracking-widest uppercase font-medium">
                  Powered by <span className="text-[#C9A227]">Artispreneur</span>
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#A0A0A0] leading-relaxed max-w-sm">
              The premier AI-powered Electronic Press Kit platform designed for music entrepreneurs,
              independent artists, managers, and labels. High-impact pitch decks that get you booked,
              streamed, and signed.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111] border border-[#2A2A2A] text-xs text-[#AAA]">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span>Vercel AI + Supabase Cloud Engine</span>
              </div>
            </div>
          </div>

          {/* Col 3: Product */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
              Platform
            </p>
            <ul className="space-y-2 text-sm text-[#A0A0A0]">
              <li>
                <Link href="/builder" className="hover:text-[#EDE9E0] transition-colors flex items-center gap-1.5">
                  <span>EPK Studio Builder</span>
                </Link>
              </li>
              <li>
                <a href="/#bio-generator" className="hover:text-[#EDE9E0] transition-colors flex items-center gap-1.5">
                  <span className="text-[#EDE9E0] font-medium">Free AI Bio Generator</span>
                  <span className="text-[9px] bg-[#C9A227]/20 text-[#C9A227] px-1 rounded font-bold">FREE</span>
                </a>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#EDE9E0] transition-colors">
                  Template Catalog
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-[#EDE9E0] transition-colors">
                  Features & Tech Specs
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#EDE9E0] transition-colors">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Solutions */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
              Solutions
            </p>
            <ul className="space-y-2 text-sm text-[#A0A0A0]">
              <li>
                <Link href="/solutions#artists" className="hover:text-[#EDE9E0] transition-colors">
                  Independent Artists
                </Link>
              </li>
              <li>
                <Link href="/solutions#managers" className="hover:text-[#EDE9E0] transition-colors">
                  Artist Managers
                </Link>
              </li>
              <li>
                <Link href="/solutions#labels" className="hover:text-[#EDE9E0] transition-colors">
                  Record Labels & Imprints
                </Link>
              </li>
              <li>
                <Link href="/solutions#pr" className="hover:text-[#EDE9E0] transition-colors">
                  PR & Publicists
                </Link>
              </li>
              <li>
                <Link href="/solutions#festivals" className="hover:text-[#EDE9E0] transition-colors">
                  Talent Buyers & Promoters
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Artispreneur Ecosystem */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
              Artispreneur Ecosystem
            </p>
            <p className="text-xs text-[#888] leading-relaxed">
              Empowering creators with enterprise tools, masterclass business frameworks, and artist autonomy.
            </p>
            <div className="pt-2">
              <a
                href="https://artispreneur.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#151515] border border-[#C9A227]/30 hover:border-[#C9A227] text-xs font-medium text-[#EDE9E0] transition-all group"
              >
                <span>Visit Artispreneur.com</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C9A227] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777]">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} ArtistsEPKs. Powered by Artispreneur. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[#555]">Built with Next.js App Router, Vercel AI SDK & Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
