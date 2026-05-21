"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  Music2,
  Plus,
  Download,
  Edit2,
  Eye,
  TrendingUp,
  FileText,
  Globe,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";

interface EPKRow {
  id: string;
  slug: string;
  template: "main" | "booking" | "brand";
  data: { artistName?: string };
  views: number;
  downloads: number;
  updated_at: string;
}

const TEMPLATE_COLORS = {
  main: "#C9A227",
  booking: "#C8102E",
  brand: "#C9A227",
};

const TEMPLATE_LABELS = {
  main: "Main EPK",
  booking: "Booking Kit",
  brand: "Brand Kit",
};

// Shown when Supabase isn't configured yet (demo mode)
const DEMO_EPKS: EPKRow[] = [
  { id: "1", slug: "luh-kel", template: "main", data: { artistName: "Luh Kel" }, views: 1842, downloads: 93, updated_at: "2025-04-10" },
  { id: "2", slug: "luh-kel-booking", template: "booking", data: { artistName: "Luh Kel" }, views: 412, downloads: 28, updated_at: "2025-04-08" },
  { id: "3", slug: "luh-kel-brand", template: "brand", data: { artistName: "Luh Kel" }, views: 256, downloads: 14, updated_at: "2025-04-01" },
];

export default function DashboardPage() {
  const [epks, setEpks] = useState<EPKRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    async function loadEpks() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes("your-project")) {
        setEpks(DEMO_EPKS);
        setIsDemoMode(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/epk");
        if (res.status === 401) {
          // Not logged in, show demo
          setEpks(DEMO_EPKS);
          setIsDemoMode(true);
        } else if (res.ok) {
          const { epks: rows } = await res.json();
          setEpks(rows || []);
        }
      } catch {
        setEpks(DEMO_EPKS);
        setIsDemoMode(true);
      } finally {
        setLoading(false);
      }
    }

    loadEpks();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this EPK? This cannot be undone.")) return;
    await fetch(`/api/epk/${id}`, { method: "DELETE" });
    setEpks((prev) => prev.filter((e) => e.id !== id));
  }

  const totalViews = epks.reduce((s, e) => s + e.views, 0);
  const totalDownloads = epks.reduce((s, e) => s + e.downloads, 0);

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-[#C9A227]/10 flex flex-col py-6 px-4 hidden md:flex">
        <Link href="/" className="flex items-center gap-2 mb-8 px-2">
          <div className="w-6 h-6 rounded bg-[#C9A227] flex items-center justify-center">
            <Music2 className="w-3 h-3 text-[#050505]" />
          </div>
          <span className="font-display text-sm tracking-wider text-[#EDE9E0]">EPK AGENT</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {[
            { icon: FileText, label: "My EPKs", href: "/dashboard", active: true },
            { icon: TrendingUp, label: "Analytics", href: "/dashboard/analytics" },
            { icon: Globe, label: "Custom Domains", href: "/dashboard/domains" },
            { icon: Settings, label: "Settings", href: "/dashboard/settings" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                item.active
                  ? "bg-[#C9A227]/10 text-[#C9A227]"
                  : "text-[#A0A0A0] hover:text-[#EDE9E0] hover:bg-[#181818]"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#C9A227]/10 pt-4">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#A0A0A0] hover:text-[#EDE9E0] w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl tracking-wider text-[#EDE9E0]">MY PRESS KITS</h1>
            <p className="text-xs text-[#A0A0A0] mt-0.5">
              {isDemoMode ? "Demo mode — sign up to create your own EPKs" : "Manage and share your EPKs"}
            </p>
          </div>
          <Button variant="gold" size="sm" asChild>
            <Link href="/builder">
              <Plus className="w-3.5 h-3.5" />
              New EPK
            </Link>
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total EPKs", value: epks.length.toString(), icon: FileText },
            { label: "Total Views", value: totalViews.toLocaleString(), icon: Globe },
            { label: "PDF Downloads", value: totalDownloads.toString(), icon: Download },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[#C9A227]/10 bg-[#0D0D0D] p-5">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className="w-4 h-4 text-[#C9A227]" />
                <span className="text-xs text-[#A0A0A0] uppercase tracking-wider">{s.label}</span>
              </div>
              <div className="font-display text-3xl text-[#C9A227] tracking-wider">{s.value}</div>
            </div>
          ))}
        </div>

        {/* EPK cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-[#C9A227] animate-spin" />
            </div>
          ) : (
            <>
              {epks.map((epk, i) => {
                const color = TEMPLATE_COLORS[epk.template];
                const artistName = epk.data?.artistName || "Unknown Artist";
                const updatedDate = epk.updated_at?.slice(0, 10) || "";

                return (
                  <motion.div
                    key={epk.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-xl border border-[#C9A227]/10 bg-[#0D0D0D] p-5 flex items-center gap-5"
                  >
                    {/* Color strip */}
                    <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ background: color }} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-[#EDE9E0] text-sm">{artistName}</span>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-medium"
                          style={{ background: `${color}20`, color }}
                        >
                          {TEMPLATE_LABELS[epk.template]}
                        </span>
                      </div>
                      <p className="text-xs text-[#555]">
                        artistepks.com/epk/{epk.slug} · Updated {updatedDate}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex items-center gap-6 text-center">
                      <div>
                        <div className="text-sm font-semibold text-[#EDE9E0]">{epk.views.toLocaleString()}</div>
                        <div className="text-[10px] text-[#555] uppercase tracking-wider">Views</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#EDE9E0]">{epk.downloads}</div>
                        <div className="text-[10px] text-[#555] uppercase tracking-wider">Downloads</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/epk/${epk.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg text-[#A0A0A0] hover:text-[#EDE9E0] hover:bg-[#181818] transition-colors"
                        title="View EPK"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <a
                        href={`/api/pdf/${epk.slug}`}
                        download
                        className="p-2 rounded-lg text-[#A0A0A0] hover:text-[#EDE9E0] hover:bg-[#181818] transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      {!isDemoMode && (
                        <Link
                          href={`/builder?edit=${epk.id}`}
                          className="p-2 rounded-lg text-[#A0A0A0] hover:text-[#EDE9E0] hover:bg-[#181818] transition-colors"
                          title="Edit EPK"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Create new card */}
              <Link
                href="/builder"
                className="block rounded-xl border border-dashed border-[#333] p-5 text-center hover:border-[#C9A227]/30 transition-colors group"
              >
                <Plus className="w-5 h-5 text-[#555] group-hover:text-[#C9A227] mx-auto mb-1 transition-colors" />
                <p className="text-sm text-[#555] group-hover:text-[#A0A0A0] transition-colors">Create a new EPK</p>
              </Link>
            </>
          )}
        </div>

        {/* Demo banner */}
        {isDemoMode && (
          <div className="mt-10 rounded-xl border border-[#C9A227]/20 bg-[#C9A227]/5 p-5">
            <p className="text-sm text-[#A0A0A0] mb-3">
              <span className="text-[#C9A227] font-medium">Demo:</span> See what a completed EPK looks like — based on the Luh Kel template files.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="gold" size="sm" asChild>
                <Link href="/epk/luh-kel" target="_blank">
                  <Eye className="w-3.5 h-3.5" />
                  Main EPK
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/epk/luh-kel-booking" target="_blank">
                  Booking Kit
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/epk/luh-kel-brand" target="_blank">
                  Brand Kit
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
