"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authGetCurrentUser, authSignOut } from "@/lib/aws-auth";
import { createClient, hasSupabase } from "@/lib/supabase/client";
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
  Zap,
  Rocket,
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
  const [userName, setUserName] = useState<string>("");

  async function loadDashboard() {
    setLoading(true);

    // Get current user — try Cognito first, then Supabase, then demo cookie
    try {
      const cognitoUser = await authGetCurrentUser();
      if (cognitoUser) {
        setUserName(cognitoUser.name || cognitoUser.email || "");
      } else if (hasSupabase) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setUserName(user.user_metadata?.name || user.email || "");
      } else {
        // Check demo session cookie
        const demoCookie = document.cookie.includes("epk-demo-session=active");
        if (demoCookie) setUserName("Demo User");
      }
    } catch { /* ok */ }

    // Load plan
    try {
      const planRes = await fetch("/api/user/plan");
      if (planRes.ok) setPlanState(await planRes.json());
    } catch { /* ignore */ }

    // Load EPKs
    try {
      const res = await fetch("/api/epk");
      if (res.status === 401) {
        setIsDemoMode(true);
      } else if (res.ok) {
        const { epks: rows } = await res.json();
        setEpks(rows || []);
        if (!rows || rows.length === 0) setIsDemoMode(true);
      } else {
        setIsDemoMode(true);
      }
    } catch {
      setIsDemoMode(true);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSignOut() {
    // Sign out of Cognito, Supabase, and demo session
    await authSignOut();
    if (hasSupabase) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    // Clear demo session cookie
    await fetch("/api/auth/demo", { method: "DELETE" }).catch(() => {});
    window.location.href = "/";
  }

  async function handleManageSubscription() {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url, error } = await res.json();
      if (url) window.location.href = url;
      else alert(error || "Could not open subscription portal.");
    } catch {
      alert("Could not open subscription portal.");
    }
  }

  const plan = PLANS[planState.plan] || PLANS.free;
  const canCreate = canCreateEPK(planState.plan, epks.length);

  // Demo EPK cards for empty/unauthenticated state
  const DEMO_EPKS: EPKRow[] = [
    { id: "demo-1", slug: "your-artist", template: "main", data: { artistName: "Your Artist" }, views: 0, downloads: 0, updated_at: new Date().toISOString() },
  ];

  const displayEpks = epks.length > 0 ? epks : isDemoMode ? [] : [];

  return (
    <main className="min-h-screen bg-[#050505]">
      {/* Top nav */}
      <nav className="border-b border-[#1A1A1A] bg-[#080808] px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/artispreneur%20logo.png"
            alt="Artispreneur"
            width="28"
            height="28"
            className="w-7 h-7 rounded object-contain"
          />
          <span className="font-display text-xs tracking-[0.2em] text-[#EDE9E0] uppercase">
            EPK Agent
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {userName && (
            <span className="text-xs text-[#666] hidden sm:block">
              {userName}
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs text-[#666] hover:text-[#EDE9E0] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl tracking-wider text-[#EDE9E0] mb-1">
              YOUR EPK DASHBOARD
            </h1>
            <p className="text-sm text-[#666]">
              Manage your Electronic Press Kits, exports, and deployments
            </p>
          </div>
          <Link href="/builder">
            <Button
              variant="gold"
              className="flex items-center gap-2 rounded-full"
              disabled={!canCreate}
            >
              <Plus className="w-4 h-4" />
              New EPK
            </Button>
          </Link>
        </div>

        {/* Plan status bar */}
        <div className="rounded-xl border border-[#C9A227]/10 bg-[#0D0D0D] p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C9A227]/10 flex items-center justify-center">
              <Crown className="w-4 h-4 text-[#C9A227]" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#EDE9E0] uppercase tracking-wider">
                {plan.name} Plan
              </p>
              <p className="text-[10px] text-[#666]">
                {epks.length} / {plan.maxEPKs === Infinity ? "∞" : plan.maxEPKs} EPKs
                {planState.currentPeriodEnd && (
                  <> · Renews {new Date(planState.currentPeriodEnd).toLocaleDateString()}</>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {planState.plan !== "pro" && (
              <button
                onClick={handleManageSubscription}
                className="text-xs text-[#C9A227] border border-[#C9A227]/20 rounded-full px-3 py-1.5 hover:bg-[#C9A227]/10 transition-colors"
              >
                Upgrade
              </button>
            )}
            {planState.plan === "pro" && (
              <button
                onClick={handleManageSubscription}
                className="text-xs text-[#666] hover:text-[#888] transition-colors"
              >
                Manage subscription
              </button>
            )}
          </div>
        </div>

        {/* EPK grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-[#C9A227] animate-spin" />
          </div>
        ) : displayEpks.length === 0 ? (
          // Empty state
          <div className="rounded-2xl border border-dashed border-[#C9A227]/20 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center mx-auto mb-4">
              <Music2 className="w-8 h-8 text-[#C9A227]" />
            </div>
            <h2 className="font-display text-xl tracking-wider text-[#EDE9E0] mb-2">
              NO EPKs YET
            </h2>
            <p className="text-sm text-[#666] mb-6 max-w-xs mx-auto">
              The agent will interview you and build your first Electronic Press Kit in minutes.
            </p>
            <Link href="/builder">
              <Button variant="gold" className="rounded-full">
                Build Your First EPK
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayEpks.map((epk, i) => (
              <motion.div
                key={epk.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-[#C9A227]/10 bg-[#0D0D0D] p-5 hover:border-[#C9A227]/25 transition-all"
              >
                {/* Template badge */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="h-0.5 w-12 rounded-full"
                    style={{ background: TEMPLATE_COLORS[epk.template] }}
                  />
                  <span
                    className="text-[9px] font-medium tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border"
                    style={{
                      color: TEMPLATE_COLORS[epk.template],
                      borderColor: `${TEMPLATE_COLORS[epk.template]}30`,
                    }}
                  >
                    {TEMPLATE_LABELS[epk.template]}
                  </span>
                </div>

                <h3 className="font-display text-lg tracking-wider text-[#EDE9E0] mb-1 truncate">
                  {epk.data?.artistName || "Untitled EPK"}
                </h3>
                <p className="text-[10px] text-[#555] mb-4">
                  Updated {new Date(epk.updated_at).toLocaleDateString()}
                </p>

                {/* Stats */}
                <div className="flex gap-4 mb-4">
                  <div>
                    <p className="text-xs font-medium text-[#EDE9E0]">{epk.views || 0}</p>
                    <p className="text-[9px] text-[#555] uppercase tracking-wider">Views</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#EDE9E0]">{epk.downloads || 0}</p>
                    <p className="text-[9px] text-[#555] uppercase tracking-wider">Downloads</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/builder?slug=${epk.slug}`} className="flex-1">
                    <button className="w-full flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg border border-[#333] text-[#888] hover:border-[#C9A227]/30 hover:text-[#C9A227] transition-all">
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </Link>
                  <Link href={`/epk/${epk.slug}`} target="_blank" className="flex-1">
                    <button className="w-full flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg border border-[#333] text-[#888] hover:border-[#C9A227]/30 hover:text-[#C9A227] transition-all">
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </Link>
                  <Link href={`/api/pdf/${epk.slug}`} target="_blank">
                    <button className="flex items-center justify-center gap-1.5 text-xs py-2 px-3 rounded-lg border border-[#333] text-[#888] hover:border-[#C9A227]/30 hover:text-[#C9A227] transition-all">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Feature quicklinks */}
        <div className="grid md:grid-cols-3 gap-4 mt-10">
          {[
            {
              icon: Rocket,
              title: "Deploy Online Site",
              desc: "Publish your EPK as a standalone website via AWS Amplify",
              href: "/builder",
              color: "#C9A227",
            },
            {
              icon: FileText,
              title: "Download PDF",
              desc: "Print-ready PDF for email attachments and booking inquiries",
              href: "/builder",
              color: "#C9A227",
            },
            {
              icon: TrendingUp,
              title: "Analytics",
              desc: "See who's viewing and downloading your EPK",
              href: "/dashboard",
              color: "#C9A227",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
            >
              <Link href={item.href}>
                <div className="rounded-xl border border-[#C9A227]/10 bg-[#0D0D0D] p-4 hover:border-[#C9A227]/25 transition-all group cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#C9A227]/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-[#C9A227]" />
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#444] group-hover:text-[#C9A227] transition-colors ml-auto" />
                  </div>
                  <p className="text-xs font-medium text-[#EDE9E0] mb-0.5">{item.title}</p>
                  <p className="text-[10px] text-[#555]">{item.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
