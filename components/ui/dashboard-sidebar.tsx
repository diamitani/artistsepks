"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  UserCheck,
  BookOpen,
  Compass,
  Mail,
  Send,
  Globe,
  Settings,
  LogOut,
  Sparkles,
  Music2,
} from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const NAV_ITEMS = [
    { icon: FileText, label: "My EPKs", href: "/dashboard", exact: true },
    { icon: UserCheck, label: "Artist Profile", href: "/dashboard/profile" },
    { icon: BookOpen, label: "Knowledge Base", href: "/dashboard/knowledge" },
    { icon: Compass, label: "Industry Directory", href: "/dashboard/directory" },
    { icon: Mail, label: "Inbox & Inquiries", href: "/dashboard/inbox" },
    { icon: Send, label: "Campaigns CRM", href: "/dashboard/campaigns" },
    { icon: Globe, label: "Custom Domains", href: "/dashboard/domains" },
  ];

  return (
    <aside className="w-64 border-r border-[#C9A227]/10 bg-[#070707] flex flex-col py-6 px-4 hidden md:flex flex-shrink-0">
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-2.5 mb-8 px-2 group">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#C9A227] to-[#E8C840] flex items-center justify-center shadow-md">
          <Music2 className="w-3.5 h-3.5 text-[#050505]" />
        </div>
        <div>
          <span className="font-display text-sm tracking-wider text-[#EDE9E0] font-bold block">
            EPK AGENT
          </span>
          <span className="text-[9px] font-mono text-[#C9A227] uppercase tracking-widest block">
            ARTISPRENEUR OS
          </span>
        </div>
      </Link>

      {/* Main Nav */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all",
                isActive
                  ? "bg-[#C9A227]/15 text-[#C9A227] border border-[#C9A227]/30 shadow-sm"
                  : "text-[#888] hover:text-[#EDE9E0] hover:bg-[#121212]"
              )}
            >
              <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-[#C9A227]" : "text-[#777]")} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile & Sign Out */}
      <div className="border-t border-[#1a1a1a] pt-4 space-y-2">
        <Link
          href="/builder"
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-[#C9A227] text-black hover:bg-[#E8C840] transition-colors w-full shadow"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Launch EPK Builder
        </Link>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#777] hover:text-[#EDE9E0] hover:bg-[#121212] w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
