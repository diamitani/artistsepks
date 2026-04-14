"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Music2,
  Sparkles,
  FileText,
  Globe,
  Zap,
  ChevronRight,
  ArrowRight,
  BadgeCheck,
  Menu,
  X,
  Plus,
  Minus,
  Star,
} from "lucide-react";

// ── Logo ──────────────────────────────────────────────────────────────────────
function ArtistEPKsLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const scale = size === "sm" ? 0.75 : size === "lg" ? 1.35 : 1;
  return (
    <div className="flex items-center gap-2" style={{ transform: `scale(${scale})`, transformOrigin: "left center" }}>
      {/* Icon mark: stylized "A" with a waveform cut through it */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Gold background square with rounded corners */}
        <rect width="32" height="32" rx="7" fill="#C9A227" />
        {/* Stylized "A" glyph */}
        <path d="M7 24L13.5 8h5L25 24h-4.2l-1.3-3.4H12.5L11.2 24H7z" fill="#050505" />
        {/* Waveform notch cut through the A crossbar area — negative space trick */}
        <path d="M13.8 17.2h4.4" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" />
        {/* Small waveform lines suggesting audio/music */}
        <path d="M10.5 19.5 Q11.5 17 12.5 19.5" stroke="#050505" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        <path d="M19.5 19.5 Q20.5 17 21.5 19.5" stroke="#050505" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      </svg>
      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span className="font-display text-[13px] tracking-[0.18em] text-[#EDE9E0] uppercase">Artists</span>
        <span className="font-display text-[13px] tracking-[0.18em] text-[#C9A227] uppercase">EPKs</span>
      </div>
    </div>
  );
}

// ── Animated gold ticker ──────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "AI-Powered EPK Creation",
  "Professional PDF Export",
  "Hosted Artist Pages",
  "Booking Template",
  "Brand Partnership Kit",
  "Spotify & YouTube Integration",
  "Press Kit in Minutes",
  "Multiple Template Styles",
];

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="w-full overflow-hidden border-y border-[#C9A227]/30 bg-[#0D0D0D] py-3">
      <div className="ticker-track flex gap-12">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex-shrink-0 flex items-center gap-4 text-xs font-display tracking-widest text-[#C9A227] uppercase"
          >
            <Star className="w-3 h-3 fill-[#C9A227]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-[#050505]/90 backdrop-blur-xl border-b border-[#C9A227]/10" : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <ArtistEPKsLogo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-[#A0A0A0] hover:text-[#EDE9E0] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button variant="gold" size="sm" asChild>
              <Link href="/builder">
                Create EPK
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          <button
            className="md:hidden text-[#EDE9E0]"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0D0D0D] border-b border-[#C9A227]/10"
          >
            <div className="px-6 py-6 space-y-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="block text-[#A0A0A0] hover:text-[#EDE9E0] transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button variant="gold" asChild className="w-full">
                  <Link href="/builder">Create EPK</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C9A227]/5 blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#C9A227]/3 blur-[80px]" />
      </div>

      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(201,162,39,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="gold" className="mb-6 px-4 py-1.5 text-xs">
            <Sparkles className="w-3 h-3 mr-1.5" />
            AI-Powered Press Kit Builder — artistsepks.com
          </Badge>

          <h1 className="font-display text-[clamp(3.5rem,10vw,8rem)] leading-none tracking-wider text-[#EDE9E0] mb-6">
            YOUR STORY,
            <br />
            <span className="text-[#C9A227]">PRESS-READY.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-[#A0A0A0] mb-10 leading-relaxed">
            Create a professional Electronic Press Kit in minutes. AI writes your bio,
            structures your story, and delivers a stunning PDF + hosted page that gets you booked.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gold" size="xl" asChild>
              <Link href="/builder">
                Build Your EPK Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild className="border border-[#C9A227]/20 text-[#EDE9E0] hover:border-[#C9A227]/50 bg-transparent">
              <a href="#templates">See Templates</a>
            </Button>
          </div>

          <p className="mt-6 text-xs text-[#666]">
            Free artist profile · $99 for a full EPK · 3 template styles
          </p>
        </motion.div>

        {/* Preview cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {[
            { label: "Main EPK", color: "#C9A227", desc: "Full artist profile" },
            { label: "Booking Kit", color: "#C8102E", desc: "For show promoters" },
            { label: "Brand Kit", color: "#C9A227", desc: "For partnerships" },
          ].map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="relative rounded-xl border border-[#C9A227]/15 bg-[#0D0D0D] p-4 text-left overflow-hidden group hover:border-[#C9A227]/40 transition-colors"
            >
              <div
                className="absolute top-0 left-0 h-0.5 w-full"
                style={{ background: t.color }}
              />
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center mb-3"
                style={{ background: `${t.color}20` }}
              >
                <Music2 className="w-4 h-4" style={{ color: t.color }} />
              </div>
              <p className="text-xs font-display tracking-wider" style={{ color: t.color }}>
                {t.label}
              </p>
              <p className="text-xs text-[#666] mt-0.5">{t.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: "2,500+", label: "EPKs Created" },
    { value: "98%", label: "Response Rate" },
    { value: "3 min", label: "Avg Build Time" },
    { value: "50+", label: "Countries" },
  ];
  return (
    <div className="border-y border-[#C9A227]/10 bg-[#0D0D0D]">
      <div className="mx-auto max-w-5xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-3xl md:text-4xl text-[#C9A227] tracking-wider">
              {s.value}
            </div>
            <div className="text-xs text-[#A0A0A0] mt-1 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Content Generation",
    desc: "Paste your basics — our AI writes a compelling bio, press quotes, and artist statement in your voice.",
    color: "#C9A227",
  },
  {
    icon: FileText,
    title: "PDF Export",
    desc: "One-click export to a professional PDF with your branding, ready to attach to any booking inquiry.",
    color: "#C9A227",
  },
  {
    icon: Globe,
    title: "Hosted EPK Page",
    desc: "Share a permanent link — artistepks.com/your-name — that always shows your latest info.",
    color: "#C9A227",
  },
  {
    icon: Zap,
    title: "3 Template Types",
    desc: "Choose from Main EPK, Booking Kit, or Brand Partnership Kit — each purpose-built for a different audience.",
    color: "#C9A227",
  },
  {
    icon: Music2,
    title: "Spotify & YouTube Embeds",
    desc: "Link your artist profiles once. Your music streams directly in your EPK — no screenshots needed.",
    color: "#C9A227",
  },
  {
    icon: BadgeCheck,
    title: "Press & Certifications",
    desc: "Showcase RIAA certifications, Billboard chart placements, and press quotes with dedicated sections.",
    color: "#C9A227",
  },
];

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <Badge variant="gold" className="mb-4">Features</Badge>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] tracking-wider text-[#EDE9E0]">
            EVERYTHING YOU NEED
          </h2>
          <p className="text-[#A0A0A0] mt-4 max-w-xl mx-auto">
            Built specifically for independent artists, bands, and music professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              viewport={{ once: true }}
              className="group relative rounded-xl border border-[#C9A227]/10 bg-[#0D0D0D] p-6 hover:border-[#C9A227]/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-[#C9A227]/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-[#C9A227]" />
              </div>
              <h3 className="font-semibold text-[#EDE9E0] mb-2">{f.title}</h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Templates showcase ────────────────────────────────────────────────────────
function BrowserFrame({ src, accent, alt }: { src: string; accent: string; alt: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPct, setScrollPct] = useState(0);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScrollPct(max > 0 ? el.scrollTop / max : 0);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl" style={{ background: "#1A1A1A" }}>
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5" style={{ background: "#111" }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <div className="flex-1 mx-3 h-5 rounded bg-[#2A2A2A] flex items-center px-3">
          <span className="text-[9px] text-[#555] truncate">artistepks.com/epk/luh-kel</span>
        </div>
      </div>

      {/* Scrollable screenshot */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative overflow-y-auto"
        style={{ height: 480 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full block"
          style={{ display: "block", minHeight: "100%" }}
        />
        {/* Bottom fade hint */}
        <div
          className="sticky bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(26,26,26,0.8), transparent)" }}
        />
      </div>

      {/* Scroll progress bar */}
      <div className="h-0.5 w-full bg-[#222]">
        <div
          className="h-full transition-all duration-150"
          style={{ width: `${scrollPct * 100}%`, background: accent }}
        />
      </div>
    </div>
  );
}

function Templates() {
  const [active, setActive] = useState<"main" | "booking" | "brand">("main");

  const templates = {
    main: {
      label: "Main EPK",
      accent: "#C9A227",
      desc: "The full artist profile — bio, discography, stats, press quotes, social links, timeline, and collaborators. Built to impress venues, labels, and media.",
      screenshot: "/previews/main-epk.png",
    },
    booking: {
      label: "Booking Kit",
      accent: "#C8102E",
      desc: "Purpose-built for promoters and talent buyers. Includes performance packages, technical rider, show history, and a direct booking call-to-action.",
      screenshot: "/previews/booking-epk.png",
    },
    brand: {
      label: "Brand Kit",
      accent: "#C9A227",
      desc: "Designed for brand partnership pitches. Clean light layout with brand value props, audience demographics, previous partnerships, and a collab inquiry CTA.",
      screenshot: "/previews/brand-epk.png",
    },
  };

  const t = templates[active];

  return (
    <section id="templates" className="py-24 bg-[#0D0D0D]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <Badge variant="gold" className="mb-4">Templates</Badge>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] tracking-wider text-[#EDE9E0]">
            3 TEMPLATE TYPES
          </h2>
          <p className="text-[#A0A0A0] mt-4">Each built for a different audience and purpose.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {(Object.keys(templates) as Array<keyof typeof templates>).map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                active === key
                  ? "text-[#050505] font-semibold"
                  : "text-[#A0A0A0] border border-[#333] hover:border-[#C9A227]/30"
              )}
              style={active === key ? { background: templates[key].accent } : {}}
            >
              {templates[key].label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Copy */}
          <motion.div
            key={active}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-display text-2xl tracking-wider mb-3" style={{ color: t.accent }}>
              {t.label.toUpperCase()}
            </h3>
            <p className="text-[#A0A0A0] leading-relaxed mb-6">{t.desc}</p>
            <div className="flex gap-3">
              <Button
                asChild
                className="rounded-full px-6 font-semibold tracking-wider text-xs uppercase"
                style={{ background: t.accent, color: "#050505" }}
              >
                <Link href={`/builder?template=${active}`}>
                  Use This Template
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full px-6 text-xs uppercase tracking-wider border-[#333] text-[#A0A0A0] hover:text-[#EDE9E0]"
              >
                <Link href={`/epk/luh-kel${active === "booking" ? "-booking" : active === "brand" ? "-brand" : ""}`} target="_blank">
                  Live Preview
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Browser frame with real screenshot */}
          <motion.div
            key={`preview-${active}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <BrowserFrame
              src={t.screenshot}
              accent={t.accent}
              alt={`${t.label} preview`}
            />
            <p className="text-center text-[10px] text-[#555] mt-2">Scroll inside the preview to see the full page</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── How it works ──────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Choose Your Template",
      desc: "Select Main EPK, Booking Kit, or Brand Kit based on who you're sending it to.",
    },
    {
      n: "02",
      title: "Fill In Your Info",
      desc: "Enter your bio, social links, stats, discography, and any press mentions.",
    },
    {
      n: "03",
      title: "AI Polishes Your Content",
      desc: "Our AI rewrites your bio in a compelling press voice and suggests improvements.",
    },
    {
      n: "04",
      title: "Export & Share",
      desc: "Download your PDF, share your hosted page link, or send directly to contacts.",
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <Badge variant="gold" className="mb-4">Process</Badge>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] tracking-wider text-[#EDE9E0]">
            HOW IT WORKS
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-5 left-[calc(100%+4px)] w-full h-px border-t border-dashed border-[#C9A227]/20" style={{ width: "calc(100% - 8px)" }} />
              )}
              <div className="font-display text-4xl text-[#C9A227]/30 mb-3">{s.n}</div>
              <h3 className="font-semibold text-[#EDE9E0] mb-2">{s.title}</h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function Pricing() {
  const [annual, setAnnual] = useState(false);

  // What's free vs. paid
  const freeIncludes = [
    "Artist bio page (hosted at artistsepks.com/you)",
    "1 profile photo",
    "Short bio (AI-generated)",
    "Social media stats + contact info",
    "View online & download as PDF",
  ];

  const tiers = [
    {
      name: "Artist",
      badge: null,
      price: { monthly: 0, annual: 0 },
      priceNote: "Forever free",
      desc: "Your public artist profile — shareable, downloadable, no credit card needed.",
      features: freeIncludes,
      cta: "Create Free Profile",
      href: "/builder",
      highlight: false,
    },
    {
      name: "EPK",
      badge: "Most Popular",
      price: { monthly: 0, annual: 0 },
      priceNote: "$99 one-time",
      desc: "One full EPK of your choice. No subscription — yours forever.",
      features: [
        "Full Main EPK or Booking Kit or Brand Kit",
        "All sections: discography, timeline, press quotes, collaborators",
        "Spotify & YouTube embeds",
        "PDF export (high-res, print-ready)",
        "Hosted page at artistsepks.com/your-name",
        "One-time payment — updates included for 12 months",
      ],
      cta: "Get Your EPK — $99",
      href: "/builder?plan=epk",
      highlight: true,
    },
    {
      name: "Pro",
      badge: null,
      price: { monthly: 29, annual: 19 },
      priceNote: null,
      desc: "For active artists and managers who need everything, always up to date.",
      features: [
        "All 3 EPK types (Main + Booking + Brand)",
        "Unlimited updates forever",
        "AI bio regeneration anytime",
        "Analytics (views, downloads, link clicks)",
        "Multiple artists / roster management",
        "Priority support",
        "Website EPK embed (coming soon)",
        "Custom domain (coming soon)",
      ],
      cta: "Start Pro",
      href: "/builder?plan=pro",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#0D0D0D]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <Badge variant="gold" className="mb-4">Pricing</Badge>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] tracking-wider text-[#EDE9E0]">
            SIMPLE PRICING
          </h2>
          <p className="text-[#A0A0A0] mt-3 max-w-lg mx-auto text-sm">
            Start free. Pay once when you need the full kit. Subscribe when you're active.
          </p>

          {/* Annual toggle — only affects Pro tier */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={cn("text-sm", !annual ? "text-[#EDE9E0]" : "text-[#666]")}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-10 h-5 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/30 transition-colors"
              style={annual ? { background: "rgba(201,162,39,0.4)" } : {}}
            >
              <div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-[#C9A227] transition-transform"
                style={{ transform: annual ? "translateX(20px)" : "translateX(2px)" }}
              />
            </button>
            <span className={cn("text-sm", annual ? "text-[#EDE9E0]" : "text-[#666]")}>
              Annual <span className="text-[#C9A227] text-xs">Save 35%</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "rounded-2xl border p-6 flex flex-col relative",
                tier.highlight
                  ? "border-[#C9A227] bg-[#C9A227]/5"
                  : "border-[#C9A227]/10 bg-[#181818]"
              )}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#C9A227] text-[#050505] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="mb-5">
                <div className="font-display text-xl tracking-wider text-[#EDE9E0] mb-2">
                  {tier.name.toUpperCase()}
                </div>

                {tier.priceNote ? (
                  /* Free or one-time */
                  <div>
                    <div className="font-display text-4xl text-[#C9A227] tracking-wider">
                      {tier.price.monthly === 0 && tier.priceNote === "Forever free" ? "Free" : tier.priceNote}
                    </div>
                    {tier.priceNote !== "Forever free" && (
                      <p className="text-xs text-[#666] mt-0.5">one-time payment</p>
                    )}
                  </div>
                ) : (
                  /* Subscription */
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl text-[#C9A227] tracking-wider">
                      ${annual ? tier.price.annual : tier.price.monthly}
                    </span>
                    <span className="text-[#666] text-sm">/mo</span>
                    {annual && <span className="text-[10px] text-[#C9A227] ml-1">billed annually</span>}
                  </div>
                )}

                <p className="text-xs text-[#A0A0A0] mt-2 leading-relaxed">{tier.desc}</p>
              </div>

              <ul className="flex-1 space-y-2.5 mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#A0A0A0]">
                    <BadgeCheck className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.highlight ? "gold" : "gold-outline"}
                className="w-full rounded-full text-xs uppercase tracking-widest"
                asChild
              >
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Comparison note */}
        <p className="text-center text-xs text-[#555] mt-8">
          All paid plans include the free Artist profile. One-time EPK purchase includes 12 months of updates — renews at $29/yr after that.
        </p>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "What is an EPK?",
    a: "An Electronic Press Kit (EPK) is a digital portfolio containing all the info a venue, label, or brand needs to evaluate you as an artist — bio, music, photos, stats, press coverage, and contact details. Think of it as your professional resume for the music industry.",
  },
  {
    q: "What's the difference between the free profile and a paid EPK?",
    a: "The free Artist profile is a clean, shareable page with your bio, one photo, social stats, and contact info — perfect for quick introductions. A full EPK adds your complete discography, career timeline, press quotes, collaborators, Spotify/YouTube embeds, performance packages, and a print-ready PDF. It's the difference between a business card and a full press kit.",
  },
  {
    q: "How does the $99 one-time EPK work?",
    a: "You pay once and get your full EPK (Main, Booking Kit, or Brand Kit — your choice) published at artistsepks.com/your-name. That includes 12 months of free updates. After 12 months you can renew for $29/yr or upgrade to Pro for unlimited updates.",
  },
  {
    q: "How does the AI content generation work?",
    a: "You fill in the basics — who you are, your sound, key achievements. Our AI rewrites it into compelling press-ready language: a strong bio, a punchy tagline, and story sections that match the template's tone. Free profiles get one generation; Pro subscribers can regenerate anytime.",
  },
  {
    q: "What does the hosted page look like?",
    a: "You get a dedicated URL at artistsepks.com/your-name. The page is fully responsive, loads your Spotify embeds and YouTube videos, and auto-updates whenever you edit your EPK.",
  },
  {
    q: "How is this different from a Wix or Squarespace site?",
    a: "ArtistsEPKs is purpose-built for the music industry. Every section — technical riders, certification badges, press quote formatting, booking packages — is pre-designed for what industry professionals expect to see. No drag-and-drop needed.",
  },
  {
    q: "Can I manage EPKs for multiple artists?",
    a: "Yes. The Pro plan includes roster management so managers and labels can maintain separate EPKs for all their artists from one account.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-12">
          <Badge variant="gold" className="mb-4">FAQ</Badge>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] tracking-wider text-[#EDE9E0]">
            QUESTIONS
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="rounded-xl border border-[#C9A227]/10 bg-[#0D0D0D] overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left gap-4"
              >
                <span className="font-medium text-[#EDE9E0]">{faq.q}</span>
                {open === i
                  ? <Minus className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
                  : <Plus className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
                }
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-[#A0A0A0] leading-relaxed border-t border-[#C9A227]/10 pt-3">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24 bg-[#0D0D0D]">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center mx-auto">
              <Music2 className="w-8 h-8 text-[#C9A227]" />
            </div>
          </div>
          <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] tracking-wider text-[#EDE9E0] mb-4">
            READY TO GET BOOKED?
          </h2>
          <p className="text-[#A0A0A0] mb-8 max-w-xl mx-auto">
            Join thousands of artists who use EPK Agent to land shows, partnerships, and press coverage.
          </p>
          <Button variant="gold" size="xl" asChild>
            <Link href="/builder">
              Build Your EPK Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <p className="text-xs text-[#555] mt-4">No credit card required</p>
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-[#C9A227]/10 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <div className="mb-3">
              <ArtistEPKsLogo size="sm" />
            </div>
            <p className="text-xs text-[#666] max-w-xs">
              Professional Electronic Press Kits for musicians, bands, and artists worldwide.
            </p>
            <p className="text-xs text-[#555] mt-1">artistsepks.com</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="text-xs text-[#C9A227] uppercase tracking-widest mb-3">Product</div>
              <ul className="space-y-2 text-[#666]">
                <li><a href="#features" className="hover:text-[#EDE9E0] transition-colors">Features</a></li>
                <li><a href="#templates" className="hover:text-[#EDE9E0] transition-colors">Templates</a></li>
                <li><a href="#pricing" className="hover:text-[#EDE9E0] transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <div className="text-xs text-[#C9A227] uppercase tracking-widest mb-3">Company</div>
              <ul className="space-y-2 text-[#666]">
                <li><a href="#faq" className="hover:text-[#EDE9E0] transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-[#EDE9E0] transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-[#EDE9E0] transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <div className="text-xs text-[#C9A227] uppercase tracking-widest mb-3">Artist</div>
              <ul className="space-y-2 text-[#666]">
                <li><Link href="/builder" className="hover:text-[#EDE9E0] transition-colors">Create EPK</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#EDE9E0] transition-colors">Dashboard</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#C9A227]/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#555]">&copy; 2025 ArtistsEPKs. All rights reserved.</p>
          <p className="text-xs text-[#555]">
            hello@artistsepks.com
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <StatsBar />
        <Features />
        <Templates />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
