"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  Layers,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Starter Free",
    id: "free",
    priceMonthly: "$0",
    priceAnnual: "$0",
    period: "Forever",
    badge: "Get Started",
    popular: false,
    description: "Perfect for testing the AI EPK builder and creating your first hosted press kit.",
    features: [
      "AI agent builds 1 complete EPK",
      "2 essential style archetypes (Dark Gold, Light Cream)",
      "Hosted shareable link at artistsepks.com/@you",
      "Spotify & Apple Music track preview embeds",
      "View-only public profile",
    ],
    cta: "Build Free EPK",
    href: "/builder",
    buttonVariant: "outline" as const,
  },
  {
    name: "Pro Artist",
    id: "pro",
    priceMonthly: "$19",
    priceAnnual: "$15",
    period: "per month",
    badge: "Most Popular",
    popular: true,
    description: "For active independent artists, producers, and touring acts who need total creative control.",
    features: [
      "Everything in Starter Free",
      "Unlimited edits & real-time updates anytime",
      "All 8 premium style archetypes (Midnight, Velvet, Vinyl, etc.)",
      "Vector Multi-Page PDF & Executive One-Sheet export",
      "High-Res 300DPI Press Asset Vault & ZIP bundle download",
      "AI Bio tone switcher (Major Label, Festival, Press)",
      "Spotify, Apple, SoundCloud & YouTube video embedding",
    ],
    cta: "Upgrade to Pro Artist",
    href: "/checkout?plan=epk_style_pro",
    buttonVariant: "gold" as const,
  },
  {
    name: "Manager & Label Suite",
    id: "manager",
    priceMonthly: "$49",
    priceAnnual: "$39",
    period: "per month",
    badge: "Best for Rosters",
    popular: false,
    description: "Built for management firms, boutique record labels, and booking agencies.",
    features: [
      "Everything in Pro Artist",
      "Up to 10 active Artist EPK profiles in one workspace",
      "DocSend-style EPK viewer analytics (Track views, listen time, photo downloads)",
      "Interactive Tech Rider & Stage Plot generator",
      "Custom domain mapping (e.g. epk.artistname.com)",
      "Password protection & private pre-release streaming links",
      "Priority AI queue & email support",
    ],
    cta: "Start Label Trial",
    href: "/checkout?plan=epk_premium",
    buttonVariant: "outline" as const,
  },
  {
    name: "Agency & Enterprise",
    id: "enterprise",
    priceMonthly: "$149",
    priceAnnual: "$119",
    period: "per month",
    badge: "Unlimited Scale",
    popular: false,
    description: "For major management rosters, PR firms, festival organizers, and entertainment conglomerates.",
    features: [
      "Everything in Manager Suite",
      "Unlimited artist profiles & roster seats",
      "100% white-label exports (remove all platform watermarks)",
      "Sync Licensing Cue Sheet & split sheet management",
      "Dedicated account manager & 1-on-1 Artispreneur onboarding",
      "Custom brand typography & CSS overrides",
    ],
    cta: "Contact Enterprise",
    href: "/contact",
    buttonVariant: "outline" as const,
  },
];

const FAQS = [
  {
    q: "Can I update my EPK after I publish it?",
    a: "Yes! With the Pro Artist and Manager plans, any changes you make in the EPK Studio update immediately on your live hosted link without needing to resend a new URL to booking agents.",
  },
  {
    q: "How does the PDF export work?",
    a: "Our export engine generates both high-resolution multi-page vector PDFs (for complete pitch decks) and single-page Executive One-Sheets. All streaming links and social handles remain clickable inside the PDF.",
  },
  {
    q: "Can I connect my own custom domain?",
    a: "Yes. On the Manager & Label Suite tier, you can map any custom domain or subdomain (such as epk.yourartistname.com) with automatic edge SSL provisioning.",
  },
  {
    q: "How do DocSend-style analytics work?",
    a: "When you share your private or public EPK link, we track open timestamps, viewer dwell time per section, track play counts, and asset downloads so you know when an A&R or promoter is reviewing your pitch.",
  },
  {
    q: "What is Artispreneur?",
    a: "Artispreneur is the premier music entrepreneurship ecosystem that powers ArtistEPKs, providing modern business frameworks, tools, and growth infrastructure to independent artists and music executives.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#050505] text-[#EDE9E0] pb-24">
      {/* Header Banner */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#1A1A1A] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#C9A227]/10 blur-[130px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#C9A227]/30 text-xs font-medium text-[#C9A227]">
            <Crown className="w-3.5 h-3.5" />
            <span>Transparent Pricing</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl tracking-wider uppercase text-[#EDE9E0]">
            Invest in Your <span className="text-[#C9A227]">Music Career</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base text-[#A0A0A0] leading-relaxed">
            Choose the plan that matches your ambition. Start free, upgrade when you&apos;re ready to pitch.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="pt-6 flex items-center justify-center gap-3">
            <span className={cn("text-xs font-semibold", !annual ? "text-[#EDE9E0]" : "text-[#777]")}>
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setAnnual(!annual)}
              className="w-12 h-6 rounded-full bg-[#181818] border border-[#333] p-0.5 relative transition-colors"
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full bg-[#C9A227] transition-transform",
                  annual ? "translate-x-6" : "translate-x-0"
                )}
              />
            </button>
            <span className={cn("text-xs font-semibold flex items-center gap-1.5", annual ? "text-[#EDE9E0]" : "text-[#777]")}>
              <span>Annual</span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
                Save 20%
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIERS.map((tier) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative shadow-xl",
                tier.popular
                  ? "bg-gradient-to-b from-[#181818] to-[#0D0D0D] border-2 border-[#C9A227] shadow-[#C9A227]/10"
                  : "bg-[#0D0D0D] border border-[#222] hover:border-[#333]"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#C9A227] text-[#050505] text-[10px] font-bold uppercase tracking-wider shadow-md">
                  {tier.badge}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-display text-2xl uppercase tracking-wide text-[#EDE9E0]">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-[#888] min-h-[36px]">
                    {tier.description}
                  </p>
                </div>

                <div className="pt-2 pb-4 border-b border-[#1E1E1E]">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl text-[#EDE9E0]">
                      {annual ? tier.priceAnnual : tier.priceMonthly}
                    </span>
                    <span className="text-xs text-[#777] font-medium">/{tier.period}</span>
                  </div>
                  {annual && tier.id !== "free" && (
                    <p className="text-[10px] text-[#22C55E] mt-0.5">Billed annually (Save 20%)</p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#CCC] block">
                    What&apos;s Included:
                  </span>
                  <ul className="space-y-2 text-xs text-[#AAA]">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#1C1C1C]">
                <Button
                  variant={tier.buttonVariant}
                  size="sm"
                  asChild
                  className={cn(
                    "w-full text-xs font-bold uppercase tracking-wider h-10",
                    tier.popular
                      ? "bg-[#C9A227] hover:bg-[#d8b030] text-[#050505]"
                      : "border-[#333] hover:border-[#666]"
                  )}
                >
                  <Link href={tier.href}>
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-3xl uppercase tracking-wider text-[#EDE9E0]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#888]">Everything you need to know about plans and billing.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#0D0D0D] border border-[#222] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-medium text-[#EDE9E0] hover:text-[#C9A227] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={cn("w-4 h-4 text-[#777] transition-transform", isOpen ? "rotate-180 text-[#C9A227]" : "")}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-[#AAA] leading-relaxed border-t border-[#181818] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
