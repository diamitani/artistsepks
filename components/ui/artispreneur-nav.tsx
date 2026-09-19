"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ChevronRight,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ArtispreneurNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  const navLinks = [
    { label: "Bio Generator", href: "/#bio-generator", badge: "Free" },
    { label: "Templates", href: "/templates" },
    { label: "Features", href: "/features" },
    { label: "Solutions", href: "/solutions" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#050505]/90 backdrop-blur-xl border-b border-[#C9A227]/15 py-3 shadow-2xl shadow-black/50"
          : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo Lockup — stable at all viewport sizes */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0 min-w-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#C9A227]/30 group-hover:border-[#C9A227] transition-all duration-300 shadow-md flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src="/artispreneur-logo.png"
                alt="Artispreneur"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div className="flex flex-col leading-tight flex-shrink-0">
              <div className="flex items-center gap-1 whitespace-nowrap">
                <span className="font-display text-base sm:text-lg tracking-[0.10em] text-[#EDE9E0] uppercase group-hover:text-white transition-colors leading-none">
                  Artists
                </span>
                <span className="font-display text-base sm:text-lg tracking-[0.10em] text-[#C9A227] uppercase leading-none">
                  EPKs
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] text-[#777] tracking-widest uppercase font-medium whitespace-nowrap leading-none mt-0.5">
                by <span className="text-[#C9A227]/80">Artispreneur</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-all relative py-1 flex items-center gap-1.5",
                    isActive
                      ? "text-[#EDE9E0] font-semibold"
                      : "text-[#A0A0A0] hover:text-[#EDE9E0]"
                  )}
                >
                  {link.label}
                  {link.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/30">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A227] rounded-full shadow-[0_0_8px_rgba(201,162,39,0.8)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-[#C9A227]/30 text-[#EDE9E0] hover:border-[#C9A227] hover:bg-[#C9A227]/10 text-xs"
                >
                  <Link href="/dashboard" className="flex items-center gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-[#888] hover:text-[#EF4444] hover:bg-[#1C1C1C] text-xs px-2.5"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-[#A0A0A0] hover:text-[#EDE9E0] hover:bg-[#181818]"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-[#C9A227]/30 text-[#EDE9E0] hover:border-[#C9A227] hover:bg-[#C9A227]/10"
            >
              <a href="/#bio-generator" className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Free Bio Generator</span>
              </a>
            </Button>
            <Button
              variant="gold"
              size="sm"
              asChild
              className="bg-[#C9A227] hover:bg-[#d8b030] text-[#050505] font-semibold shadow-lg shadow-[#C9A227]/20"
            >
              <Link href="/builder" className="flex items-center gap-1.5">
                <span>EPK Studio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lg:hidden text-[#EDE9E0] p-2 rounded-lg bg-[#141414] border border-[#2A2A2A] hover:border-[#C9A227]/40"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0A0A0A]/95 backdrop-blur-2xl border-b border-[#C9A227]/20 shadow-2xl"
          >
            <div className="px-6 py-6 space-y-4">
              <div className="grid gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
                      pathname === link.href
                        ? "bg-[#181818] text-[#C9A227] font-semibold"
                        : "text-[#A0A0A0] hover:text-[#EDE9E0] hover:bg-[#141414]"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/30">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-[#222] flex flex-col gap-2.5">
                {user ? (
                  <>
                    <Button variant="outline" asChild className="w-full border-[#C9A227]/30 text-[#EDE9E0]">
                      <Link href="/dashboard" onClick={() => setOpen(false)}>
                        <LayoutDashboard className="w-4 h-4 mr-1.5 inline text-[#C9A227]" />
                        My Dashboard &amp; EPKs
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleSignOut();
                        setOpen(false);
                      }}
                      className="w-full text-[#888] hover:text-[#EF4444]"
                    >
                      <LogOut className="w-4 h-4 mr-1.5 inline" />
                      Sign Out ({user.email?.split("@")[0]})
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" asChild className="w-full border-[#333]">
                    <Link href="/auth/login" onClick={() => setOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                )}
                <Button
                  variant="gold"
                  asChild
                  className="w-full bg-[#C9A227] text-[#050505] font-semibold"
                >
                  <Link href="/builder" onClick={() => setOpen(false)}>
                    Open EPK Studio <ChevronRight className="w-4 h-4 ml-1 inline" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
