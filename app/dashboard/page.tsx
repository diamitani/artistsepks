"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { PLANS, canCreateEPK } from "@/lib/plans";
import type { PlanId } from "@/lib/plans";
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
  Crown,
  ArrowUpRight,
  BadgeCheck,
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

interface PlanState {
  plan: PlanId;
  status: string;
  currentPeriodEnd?: string;
}

const TEMPLATE_COLORS: Record<string, string> = {
  main: "#C9A227",
  booking: "#C8102E",
  brand: "#C9A227",
};

const TEMPLATE_LABELS: Record<string, string> = {
  main: "Main EPK",
  booking: "Booking Kit",
  brand: "Brand Kit",
};

export default function DashboardPage() {
  const [epks, setEpks] = useState<EPKRow[]>([]);
  const [planState, setPlanState] = useState<PlanState>({ plan: "free", status: "inactive" });
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  async function loadDashboard() {
    setLoading(true);

    // Load plan
    try {
      const planRes = await fetch("/api/user/plan");
      if (planRes.ok) setPlanState(await planRes.json());
    } catch { /* ignore */ }

    // Load EPKs
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes("your-project")) {
      setEpks([]);
      setIsDemoMode(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/epk");
      if (res.status === 401) {
        setEpks([]);
        setIsDemoMode(true);
      } else if (res.ok) {
        const { epks: rows } = await res.json();
        setEpks(rows || []);
      }
    } catch {
      setEpks([]);
      setIsDemoMode(true);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function handleManageSubscription() {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url, error } = await res.json();
      if (url) window.location.href = url;
      else alert(error || "Could not open portal");
    } catch {
      alert("Something went wrong");
    }
  }

  const totalViews = epks.reduce((s, e) => s + e.views, 0);
  const totalDownloads = epks.reduce((s, e) => s + e.downloads, 0);
  const planInfo = PLANS[planState.plan];
  const canCreate = canCreateEPK(planState.plan, epks.length);

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
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Plan Banner */}
        {planState.plan !== "pro_monthly" && planState.plan !== "pro_yearly" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-[#C9A227]/20 bg-gradient-to-r from-[#C9A227]/10 to-[#C9A227]/5 p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#C9A227]/20 flex items-center justify-center">
                <Crown className="w-4 h-4 text-[#C9A227]" />
              </div>
              <div>
                <p className="text-sm text-[#EDE9E0] font-medium">
                  {planState.plan === "free"
                    ? "You're on the Free plan"
                    : `You're on the ${planInfo?.name} plan`}
                </p>
                <p className="text-xs text-[#A0A0A0]">
                  {planState.plan === "free"
                    ? "Upgrade to publish full EPKs with all sections"
                    : "Manage your subscription anytime"}
                </p>
              </div>
            </div>
            <Button variant="gold" size="sm" asChild className="rounded-full">
              <Link href="/#pricing">
                {planState.plan === "free" ? "Upgrade" : "View Plans"}
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </Button>
          </motion.div>
        )}

        {/* Pro status banner */}
        {(planState.plan === "pro_monthly" || planState.plan === "pro_yearly") && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-[#27C93F]/20 bg-[#27C93F]/5 p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#27C93F]/20 flex items-center justify-center">
                <BadgeCheck className="w-4 h-4 text-[#27C93F]" />
              </div>
              <div>
                <p className="text-sm text-[#EDE9E0] font-medium">
                  Pro Plan Active
                </p>
                <p className="text-xs text-[#A0A0A0]">
                  {planInfo?.name} — unlimited EPKs, AI regen, analytics
                  {planState.currentPeriodEnd &&
                    ` · Renews ${new Date(planState.currentPeriodEnd).toLocaleDateString()}`}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageSubscription}
              className="rounded-full text-xs border-[#333]"
            >
              Manage Subscription
            </Button>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl tracking-wider text-[#EDE9E0]">
              MY PRESS KITS
            </h1>
            <p className="text-xs text-[#A0A0A0] mt-0.5">
              {isDemoMode
                ? "Demo mode — set up Supabase to save your EPKs"
                : `${epks.length} EPK${epks.length !== 1 ? "s" : ""} · ${planInfo?.name} plan`}
            </p>
          </div>
          {canCreate ? (
            <Button variant="gold" size="sm" asChild>
              <Link href="/builder">
                <Plus className="w-3.5 h-3.5" />
                New EPK
              </Link>
            </Button>
          ) : planState.plan === "free" ? (
            <Button variant="gold" size="sm" asChild>
              <Link href="/#pricing">
                <Crown className="w-3.5 h-3.5" />
                Upgrade to Create EPK
              </Link>
            </Button>
          ) : planState.plan === "epk_onetime" && epks.length >= 1 ? (
            <p className="text-xs text-[#C9A227]">EPK limit reached — upgrade to Pro for more</p>
          ) : null}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total EPKs", value: epks.length.toString(), icon: FileText },
            { label: "Total Views", value: totalViews.toLocaleString(), icon: Globe },
            { label: "PDF Downloads", value: totalDownloads.toString(), icon: Download },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-[#C9A227]/10 bg-[#0D0D0D] p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <s.icon className="w-4 h-4 text-[#C9A227]" />
                <span className="text-xs text-[#A0A0A0] uppercase tracking-wider">
                  {s.label}
                </span>
              </div>
              <div className="font-display text-3xl text-[#C9A227] tracking-wider">
                {s.value}
              </div>
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
                const artistName = epk.data?.artistName || "Untitled Artist";
                const updatedDate = epk.updated_at?.slice(0, 10) || "";

                return (
                  <motion.div
                    key={epk.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-xl border border-[#C9A227]/10 bg-[#0D0D0D] p-5 flex items-center gap-5"
                  >
                    <div
                      className="w-1 h-12 rounded-full flex-shrink-0"
                      style={{ background: color }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-[#EDE9E0] text-sm">
                          {artistName}
                        </span>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-medium"
                          style={{ background: `${color}20`, color }}
                        >
                          {TEMPLATE_LABELS[epk.template]}
                        </span>
                      </div>
                      <p className="text-xs text-[#555]">
                        artistsepks.com/epk/{epk.slug} · Updated {updatedDate}
                      </p>
                    </div>

                    <div className="hidden md:flex items-center gap-6 text-center">
                      <div>
                        <div className="text-sm font-semibold text-[#EDE9E0]">
                          {epk.views.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-[#555] uppercase tracking-wider">
                          Views
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#EDE9E0]">
                          {epk.downloads}
                        </div>
                        <div className="text-[10px] text-[#555] uppercase tracking-wider">
                          Downloads
                        </div>
                      </div>
                    </div>

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
                      <Link
                        href={`/builder?edit=${epk.id}`}
                        className="p-2 rounded-lg text-[#A0A0A0] hover:text-[#EDE9E0] hover:bg-[#181818] transition-colors"
                        title="Edit EPK"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}

              {/* Empty / Create new card */}
              {canCreate && (
                <Link
                  href="/builder"
                  className="block rounded-xl border border-dashed border-[#333] p-5 text-center hover:border-[#C9A227]/30 transition-colors group"
                >
                  <Plus className="w-5 h-5 text-[#555] group-hover:text-[#C9A227] mx-auto mb-1 transition-colors" />
                  <p className="text-sm text-[#555] group-hover:text-[#A0A0A0] transition-colors">
                    Create a new EPK
                  </p>
                </Link>
              )}

              {epks.length === 0 && !canCreate && (
                <div className="text-center py-10">
                  <Music2 className="w-10 h-10 text-[#333] mx-auto mb-3" />
                  <p className="text-sm text-[#555]">
                    No EPKs yet. Upgrade to create your first one.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
