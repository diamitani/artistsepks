"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Music2, Sparkles, FileText, Globe, Zap, BadgeCheck,
  ChevronRight, ArrowRight, Menu, X, Plus, Minus,
  Copy, Check, X as XIcon,
  User, Pen,
} from "lucide-react";

// ── Logo ──────────────────────────────────────────────────────────────────────
function ArtistsLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? 0.75 : size === "lg" ? 1.35 : 1;
  return (
    <div className="flex items-center gap-2" style={{ transform: `scale(${s})`, transformOrigin: "left center" }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="7" fill="#C9A227" />
        <path d="M7 24L13.5 8h5L25 24h-4.2l-1.3-3.4H12.5L11.2 24H7z" fill="#050505" />
        <path d="M13.8 17.2h4.4" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" />
        <path d="M10.5 19.5 Q11.5 17 12.5 19.5" stroke="#050505" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        <path d="M19.5 19.5 Q20.5 17 21.5 19.5" stroke="#050505" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="font-display text-[13px] tracking-[0.18em] text-[#EDE9E0] uppercase">Artists</span>
        <span className="font-display text-[13px] tracking-[0.18em] text-[#C9A227] uppercase">EPKs</span>
      </div>
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  if (typeof window !== "undefined" && !ticking.current) {
    ticking.current = true;
    window.addEventListener("scroll", () => {
      requestAnimationFrame(() => setScrolled(window.scrollY > 40));
    }, { passive: true });
  }

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-[#050505]/90 backdrop-blur-xl border-b border-[#C9A227]/10" : "bg-transparent"
    )}>
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5"><ArtistsLogo /></Link>
          <nav className="hidden md:flex items-center gap-8">
            {["Features", "Templates", "Pricing", "FAQ"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-[#A0A0A0] hover:text-[#EDE9E0] transition-colors">{l}</a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm" asChild className="border-[#333]">
              <Link href="/profile-wizard">Free Profile</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild><Link href="/auth/login">Sign In</Link></Button>
            <Button variant="gold" size="sm" asChild>
              <Link href="/auth/signup?redirectTo=/builder">Create EPK <ChevronRight className="w-3.5 h-3.5" /></Link>
            </Button>
          </div>
          <button className="md:hidden text-[#EDE9E0]" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-[#0D0D0D] border-b border-[#C9A227]/10">
            <div className="px-6 py-6 space-y-4">
              {["Features", "Templates", "Pricing", "FAQ"].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="block text-[#A0A0A0] hover:text-[#EDE9E0]" onClick={() => setOpen(false)}>{l}</a>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Button variant="outline" asChild className="w-full"><Link href="/auth/login">Sign In</Link></Button>
                <Button variant="gold" asChild className="w-full"><Link href="/auth/signup?redirectTo=/builder">Create EPK</Link></Button>
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
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#C9A227]/5 blur-[160px]" />
      </div>
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(201,162,39,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Badge variant="gold" className="mb-6 px-4 py-1.5 text-xs">
            <Sparkles className="w-3 h-3 mr-1.5" /> AI-Powered Press Kit Builder
          </Badge>
          <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-none tracking-wider text-[#EDE9E0] mb-6">
            PRESS KITS THAT<br/><span className="text-[#C9A227]">GET YOU BOOKED.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-[#A0A0A0] mb-10 leading-relaxed">
            Create a professional Electronic Press Kit in minutes. AI writes your bio,
            pulls your stats from Spotify &amp; social media, and delivers a stunning PDF + hosted page.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gold" size="xl" asChild>
              <Link href="/auth/signup?redirectTo=/builder">Build Your EPK Free <ArrowRight className="w-4 h-4" /></Link>
            </Button>
            <Button variant="outline" size="xl" asChild className="border border-[#C9A227]/20 text-[#EDE9E0] hover:border-[#C9A227]/50 bg-transparent">
              <a href="#how-it-works">How It Works</a>
            </Button>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { label: "Main EPK", color: "#C9A227", desc: "Full artist profile" },
              { label: "Booking Kit", color: "#C8102E", desc: "For promoters" },
              { label: "Brand Kit", color: "#C9A227", desc: "For partnerships" },
            ].map((t, i) => (
              <motion.div key={t.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                className="rounded-xl border border-[#C9A227]/15 bg-[#0D0D0D] p-4 text-left group hover:border-[#C9A227]/40 transition-colors">
                <div className="h-0.5 w-full mb-3 rounded-full" style={{ background: t.color }} />
                <p className="text-xs font-display tracking-wider" style={{ color: t.color }}>{t.label}</p>
                <p className="text-xs text-[#666] mt-0.5">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Sparkles, title: "AI Bio Writing", desc: "Our AI writes press-ready bios and taglines from your notes. No more staring at a blank page.", color: "#C9A227" },
  { icon: FileText, title: "PDF Export", desc: "One click to a professional PDF with your branding, ready for any booking inquiry.", color: "#C9A227" },
  { icon: Globe, title: "Hosted Page", desc: "Get a permanent link at artistepks.com/your-name that always shows your latest EPK.", color: "#C9A227" },
  { icon: Zap, title: "3 Templates", desc: "Main EPK, Booking Kit, or Brand Kit — each purpose-built for a different audience.", color: "#C9A227" },
  { icon: Music2, title: "Spotify & YouTube", desc: "Link your profiles once. Your music streams directly — no screenshots needed.", color: "#C9A227" },
  { icon: BadgeCheck, title: "Press & Certifications", desc: "Show RIAA certifications, chart placements, and press quotes in dedicated sections.", color: "#C9A227" },
];

function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <Badge variant="gold" className="mb-4">Features</Badge>
          <h2 className="font-display text-[clamp(2.5rem,5vw,3.5rem)] tracking-wider text-[#EDE9E0]">EVERYTHING YOU NEED</h2>
          <p className="text-[#A0A0A0] mt-4 max-w-xl mx-auto">Built for independent artists, bands, and music professionals.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} viewport={{ once: true }}
              className="group rounded-xl border border-[#C9A227]/10 bg-[#0D0D0D] p-6 hover:border-[#C9A227]/30 hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-[#C9A227]/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-[#C9A227]" />
              </div>
              <h3 className="font-semibold text-[#EDE9E0] mb-2 text-sm">{f.title}</h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
const STEPS = [
  { icon: User, title: "Tell Us About You", desc: "Share your artist name, genre, hometown, and career highlights. Upload photos, links, and press.", color: "#C9A227" },
  { icon: Sparkles, title: "AI Writes Your Bio", desc: "Our AI crafts a press-ready bio from your notes — no more writer's block. Edit anytime.", color: "#C9A227" },
  { icon: FileText, title: "Choose Your Template", desc: "Main EPK for media, Booking Kit for promoters, or Brand Kit for partnerships. Each purpose-built.", color: "#C9A227" },
  { icon: Globe, title: "Publish & Share", desc: "Get a permanent link + PDF export. Your EPK stays updated and ready to send anywhere.", color: "#C9A227" },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <Badge variant="gold" className="mb-4">How It Works</Badge>
          <h2 className="font-display text-[clamp(2.5rem,5vw,3.5rem)] tracking-wider text-[#EDE9E0]">YOUR EPK IN 4 STEPS</h2>
          <p className="text-[#A0A0A0] mt-4 max-w-xl mx-auto">
            No design skills needed. No complicated tools. Just your story, your stats, and your sound.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent" />
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center mx-auto mb-5 relative z-10 group-hover:bg-[#C9A227]/20 transition-colors">
                <s.icon className="w-6 h-6 text-[#C9A227]" />
              </div>
              <span className="font-display text-[10px] tracking-[0.2em] text-[#C9A227] uppercase mb-2 block">
                Step {i + 1}
              </span>
              <h3 className="font-semibold text-[#EDE9E0] mb-2 text-sm">{s.title}</h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed max-w-[220px] mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="gold" size="lg" asChild className="rounded-full">
            <Link href="/auth/signup?redirectTo=/builder">Start Your EPK Free <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ── Templates ─────────────────────────────────────────────────────────────────
function Templates() {
  const [active, setActive] = useState<"main" | "booking" | "brand">("main");
  const templates = {
    main: { label: "Main EPK", accent: "#C9A227", desc: "Full artist profile — bio, discography, stats, press quotes, and timeline. For media, labels, and venues.", img: "/previews/main-epk.png" },
    booking: { label: "Booking Kit", accent: "#C8102E", desc: "Built for promoters. Performance packages, technical rider, show history, and direct booking CTA.", img: "/previews/booking-epk.png" },
    brand: { label: "Brand Kit", accent: "#C9A227", desc: "Brand partnership pitch. Light layout with value props, audience data, past partnerships, and collab CTA.", img: "/previews/brand-epk.png" },
  };
  const t = templates[active];

  return (
    <section id="templates" className="py-24 md:py-32 bg-[#0D0D0D]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <Badge variant="gold" className="mb-4">Templates</Badge>
          <h2 className="font-display text-[clamp(2.5rem,5vw,3.5rem)] tracking-wider text-[#EDE9E0]">3 TEMPLATES, 1 TOOL</h2>
        </div>
        <div className="flex justify-center gap-2 mb-10">
          {(Object.keys(templates) as Array<keyof typeof templates>).map((key) => (
            <button key={key} onClick={() => setActive(key)}
              className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all", active === key ? "text-[#050505] font-semibold" : "text-[#A0A0A0] border border-[#333] hover:border-[#C9A227]/30")}
              style={active === key ? { background: templates[key].accent } : {}}>
              {templates[key].label}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div key={active} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
            <h3 className="font-display text-2xl tracking-wider mb-3" style={{ color: t.accent }}>{t.label.toUpperCase()}</h3>
            <p className="text-[#A0A0A0] leading-relaxed mb-6">{t.desc}</p>
            <div className="flex gap-3">
              <Button asChild className="rounded-full px-6 font-semibold tracking-wider text-xs uppercase" style={{ background: t.accent, color: "#050505" }}>
                <Link href={`/auth/signup?redirectTo=/builder&template=${active}`}>Use This Template <ArrowRight className="w-3.5 h-3.5" /></Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-6 text-xs border-[#333]">
                <Link href={`/epk/luh-kel${active === "booking" ? "-booking" : active === "brand" ? "-brand" : ""}`} target="_blank">Live Preview</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div key={`p-${active}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#1A1A1A]">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-[#111]">
              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" /><div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" /><div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" /></div>
              <div className="flex-1 mx-3 h-5 rounded bg-[#2A2A2A] flex items-center px-3"><span className="text-[9px] text-[#555] truncate">artistepks.com/epk/artist</span></div>
            </div>
            <div className="relative overflow-y-auto" style={{ height: 420 }}>
              <img src={t.img} alt={`${t.label} preview`} className="w-full block" style={{ minHeight: "100%" }} />
              <div className="sticky bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(26,26,26,0.8), transparent)" }} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Stripe Checkout Button ────────────────────────────────────────────────────
function StripePricingButton({ plan, label, variant }: { plan: string; label: string; variant: "gold" | "gold-outline" }) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          successUrl: `${window.location.origin}/checkout/success?plan=${plan}`,
          cancelUrl: `${window.location.origin}/#pricing`,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Checkout failed. Please try again.");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant={variant} className="w-full rounded-full text-xs uppercase tracking-widest" onClick={handleCheckout} disabled={loading}>
      {loading ? "Redirecting..." : label}
    </Button>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function Pricing() {
  const tiers = [
    {
      name: "Free", badge: null,
      price: "$0", note: "One EPK",
      desc: "AI builds your press kit from scratch. View and share — forever free.",
      features: ["AI agent interviews you", "Builds full EPK automatically", "2 basic styles", "Hosted at artistsepks.com/you", "Shareable link"],
      cta: "Generate Free EPK", plan: null, highlight: false,
    },
    {
      name: "Edit Access", badge: null,
      price: "$9.99", note: "Per EPK",
      desc: "Unlock editing, updating, and 5 style options for your EPK.",
      features: ["Edit & update anytime", "5 premium styles", "Custom accent colors", "PDF download", "Bio rewriting"],
      cta: "Unlock Editing — $9.99", plan: "epk_edit", highlight: false,
    },
    {
      name: "Style Pro", badge: "Popular",
      price: "$20", note: "Per EPK",
      desc: "Cinematic layouts, spring animations, taste-skill designs.",
      features: ["8 style archetypes", "Cinematic cascade layouts", "Spring physics animations", "Staggered reveals", "Spotify + YouTube embeds"],
      cta: "Go Style Pro — $20", plan: "epk_style_pro", highlight: true,
    },
    {
      name: "Premium", badge: null,
      price: "$49", note: "Per EPK",
      desc: "Agency-grade design. Double-Bezel cards, custom domain, analytics.",
      features: ["Full taste-skill designs", "Double-Bezel architecture", "Custom domain", "Analytics dashboard", "Priority support"],
      cta: "Go Premium — $49", plan: "epk_premium", highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <Badge variant="gold" className="mb-4">Pricing</Badge>
          <h2 className="font-display text-[clamp(2.5rem,5vw,3.5rem)] tracking-wider text-[#EDE9E0]">GENERATE FREE. PAY TO CUSTOMIZE.</h2>
          <p className="text-[#A0A0A0] mt-3">The agent builds your EPK for free. Editing, styling, and premium designs are per-EPK purchases.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-4 items-stretch">
          {tiers.map((tier, i) => (
            <motion.div key={tier.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
              className={cn("rounded-2xl border p-6 flex flex-col relative", tier.highlight ? "border-[#C9A227] bg-[#C9A227]/5" : "border-[#C9A227]/10 bg-[#181818]")}>
              {tier.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-[#C9A227] text-[#050505] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">{tier.badge}</span></div>}
              <div className="mb-5">
                <div className="font-display text-lg tracking-wider text-[#EDE9E0] mb-2 uppercase">{tier.name}</div>
                <div className="font-display text-4xl text-[#C9A227] tracking-wider">{tier.price}</div>
                <p className="text-xs text-[#666] mt-0.5">{tier.note}</p>
                <p className="text-xs text-[#A0A0A0] mt-3 leading-relaxed">{tier.desc}</p>
              </div>
              <ul className="flex-1 space-y-2.5 mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#A0A0A0]">
                    <BadgeCheck className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {tier.plan ? (
                <StripePricingButton plan={tier.plan} label={tier.cta} variant={tier.highlight ? "gold" : "gold-outline"} />
              ) : (
                <Button variant="gold-outline" className="w-full rounded-full text-xs uppercase tracking-widest" asChild>
                  <Link href="/auth/signup?redirectTo=/builder">{tier.cta}</Link>
                </Button>
              )}
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-[#555] mt-8">One-time EPK includes 12 months of updates. Renews at $29/yr.</p>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "What is an EPK?", a: "An Electronic Press Kit (EPK) is your professional resume for the music industry — bio, music, photos, stats, press, and contact info all in one place." },
  { q: "What's the difference between Free and paid?", a: "Free gives you a shareable artist profile with AI bio and PDF. The $99 EPK unlocks your full press kit with all sections, embeds, and a high-res PDF. Pro adds unlimited updates, all 3 templates, and roster management." },
  { q: "How does the AI content generation work?", a: "You fill in the basics — who you are, your sound, key achievements. Our AI rewrites it into compelling press-ready copy. Free profiles get one generation." },
  { q: "Can I manage EPKs for multiple artists?", a: "Yes. The Pro plan includes roster management so managers and labels can maintain EPKs for all their artists from one account." },
  { q: "How is this different from a website builder?", a: "Every section — bio formatting, technical riders, certification badges, booking packages — is pre-designed for what industry professionals expect. No templates, no drag-and-drop." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-24 md:py-32 bg-[#0D0D0D]">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-12">
          <Badge variant="gold" className="mb-4">FAQ</Badge>
          <h2 className="font-display text-[clamp(2.5rem,5vw,3.5rem)] tracking-wider text-[#EDE9E0]">QUESTIONS</h2>
        </div>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border border-[#C9A227]/10 bg-[#0D0D0D] overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left gap-4">
                <span className="font-medium text-[#EDE9E0] text-sm">{faq.q}</span>
                {open === i ? <Minus className="w-4 h-4 text-[#C9A227] flex-shrink-0" /> : <Plus className="w-4 h-4 text-[#C9A227] flex-shrink-0" />}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-[#A0A0A0] leading-relaxed border-t border-[#C9A227]/10 pt-3">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="w-16 h-16 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center mx-auto mb-6">
            <Music2 className="w-8 h-8 text-[#C9A227]" />
          </div>
          <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] tracking-wider text-[#EDE9E0] mb-4">READY TO GET BOOKED?</h2>
          <p className="text-[#A0A0A0] mb-8 max-w-xl mx-auto">Join artists using EPK Agent to land shows, partnerships, and press coverage.</p>
          <Button variant="gold" size="xl" asChild>
            <Link href="/auth/signup?redirectTo=/builder">Build Your EPK Free <ArrowRight className="w-4 h-4" /></Link>
          </Button>
          <p className="text-xs text-[#555] mt-4">No credit card required</p>
        </motion.div>
      </div>
    </section>
  );
}

// ── Free Bio Updater Widget ────────────────────────────────────────────────────
function BioUpdater() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "generating" | "result">("form");
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [hometown, setHometown] = useState("");
  const [notes, setNotes] = useState("");
  const [bio, setBio] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!name.trim()) return;
    setError("");
    setStep("generating");
    setBio("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistName: name.trim(),
          genre: genre.trim() || undefined,
          hometown: hometown.trim() || undefined,
          rawBio: notes.trim() || undefined,
          template: "main",
        }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6);
            if (payload === "[DONE]") break;
            try {
              const data = JSON.parse(payload);
              if (data.text) text += data.text;
            } catch { /* skip partial */ }
          }
        }
      }

      setBio(text);
      setStep("result");
    } catch {
      setError("Something went wrong. Try again.");
      setStep("form");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setName("");
    setGenre("");
    setHometown("");
    setNotes("");
    setBio("");
    setError("");
    setStep("form");
  };

  if (!open) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-[#C9A227] text-[#050505] shadow-xl shadow-[#C9A227]/20 flex items-center justify-center hover:bg-[#E8C840] transition-colors"
        title="Free AI Bio Writer"
      >
        <Pen className="w-6 h-6" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] rounded-2xl border border-[#C9A227]/20 bg-[#0D0D0D] shadow-2xl shadow-black/50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#C9A227]/10 bg-[#0A0A0A]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#C9A227]/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#C9A227]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#EDE9E0] tracking-wider uppercase">Free Bio Writer</span>
            <p className="text-[9px] text-[#555]">AI-powered press kit bio</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-[#555] hover:text-[#EDE9E0] hover:bg-[#181818] transition-colors">
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 max-h-[420px] overflow-y-auto scrollbar-hide">
        {step === "form" && (
          <div className="space-y-3">
            <p className="text-xs text-[#A0A0A0] leading-relaxed mb-3">
              Drop a few details below and our AI will write a press-ready bio for you. Free, no account needed.
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Artist name *"
              className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-[#EDE9E0] placeholder:text-[#555] focus:outline-none focus:border-[#C9A227]/50 transition-colors"
            />
            <div className="flex gap-2">
              <input
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Genre"
                className="flex-1 bg-[#111] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-[#EDE9E0] placeholder:text-[#555] focus:outline-none focus:border-[#C9A227]/50 transition-colors"
              />
              <input
                value={hometown}
                onChange={(e) => setHometown(e.target.value)}
                placeholder="Hometown"
                className="flex-1 bg-[#111] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-[#EDE9E0] placeholder:text-[#555] focus:outline-none focus:border-[#C9A227]/50 transition-colors"
              />
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell us about yourself — achievements, influences, style, etc."
              rows={3}
              className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-[#EDE9E0] placeholder:text-[#555] focus:outline-none focus:border-[#C9A227]/50 transition-colors resize-none"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <Button
              variant="gold"
              size="sm"
              className="w-full rounded-lg"
              onClick={handleGenerate}
              disabled={!name.trim()}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Bio
            </Button>
            <p className="text-[9px] text-[#444] text-center">Free preview — create an account for the full EPK</p>
          </div>
        )}

        {step === "generating" && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-10 h-10 rounded-xl bg-[#C9A227]/10 flex items-center justify-center mb-4">
              <div className="w-5 h-5 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-sm text-[#A0A0A0]">Writing your bio...</p>
            <p className="text-[10px] text-[#555] mt-1">Crafting something press-ready</p>
          </div>
        )}

        {step === "result" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#C9A227] font-medium tracking-wider uppercase">Your Bio</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-[#555] hover:text-[#C9A227] hover:bg-[#C9A227]/10 transition-colors"
              >
                {copied ? (
                  <><Check className="w-3 h-3 text-[#27C93F]" /> Copied</>
                ) : (
                  <><Copy className="w-3 h-3" /> Copy</>
                )}
              </button>
            </div>
            <div className="rounded-xl border border-[#222] bg-[#111] p-4">
              <p className="text-sm text-[#E0DCD4] leading-relaxed whitespace-pre-wrap">{bio}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 rounded-lg border-[#333] text-xs" onClick={handleReset}>
                Try Again
              </Button>
              <Button variant="gold" size="sm" className="flex-1 rounded-lg text-xs" asChild>
                <Link href="/auth/signup?redirectTo=/builder">
                  Build Full EPK <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[#C9A227]/5 bg-[#0A0A0A]">
        <p className="text-[9px] text-[#444] text-center">
          Powered by AI — review before publishing
        </p>
      </div>

      <div ref={messagesEndRef} />
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Templates />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <BioUpdater />
    </>
  );
}
