"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Download, Check, Copy, ExternalLink, Loader2, Package } from "lucide-react";
import type { EPKData } from "@/lib/types";
import { AuthGateModal } from "@/components/ui/auth-gate-modal";
import { createClient } from "@/lib/supabase/client";

interface Props {
  data: EPKData;
  slug?: string | null;
  user?: unknown;
}

export function DeployMenu({ data, slug, user }: Props) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportingBundle, setExportingBundle] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deployUrl, setDeployUrl] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function checkAuth(): Promise<boolean> {
    if (user) return true;
    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) return true;
    } catch {
      // ignore
    }
    setShowAuthModal(true);
    return false;
  }

  const handleExportHtml = async () => {
    if (!data.artistName) return;
    const isAuthed = await checkAuth();
    if (!isAuthed) return;

    setExporting(true);

    try {
      const res = await fetch("/api/export/html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.artistName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-site.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed:", e);
    }

    setExporting(false);
    setOpen(false);
  };

  const handleExportBundle = async () => {
    if (!data.artistName) return;
    const isAuthed = await checkAuth();
    if (!isAuthed) return;

    setExportingBundle(true);

    try {
      const res = await fetch("/api/export/bundle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: { background: { artistName: data.artistName, genre: data.genre }, contact: { email: data.bookingEmail } }, template: data.template }),
      });

      if (!res.ok) throw new Error("Bundle export failed");

      const { bundle } = await res.json();
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.artistName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-source-bundle.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Bundle export failed:", e);
    }

    setExportingBundle(false);
    setOpen(false);
  };

  const handleCopyDeployUrl = () => {
    const url = slug
      ? `${window.location.origin}/epk/${slug}`
      : `${window.location.origin}/builder`;
    setDeployUrl(url);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const vercelUrl = slug
    ? `https://vercel.com/new/clone?repository-url=${encodeURIComponent("https://github.com/vercel/next.js/tree/canary/examples/hello-world")}&env=NEXT_PUBLIC_EPK_SLUG=${slug}&envDescription=Your+EPK+slug+from+ArtistEPKs`
    : "https://vercel.com/new";

  if (!data.artistName) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#333] text-[#888] text-[10px] font-medium tracking-wider uppercase hover:border-[#C9A227]/30 hover:text-[#C9A227] transition-colors"
      >
        <Globe className="w-3 h-3" />
        Deploy / Export
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[280px] bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Export standalone HTML */}
          <div className="p-3 border-b border-[#1E1E1E]">
            <button
              onClick={handleExportHtml}
              disabled={exporting}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#181818] transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#181818] flex items-center justify-center group-hover:bg-[#C9A227]/10 transition-colors">
                {exporting ? (
                  <Loader2 className="w-4 h-4 text-[#C9A227] animate-spin" />
                ) : (
                  <Download className="w-4 h-4 text-[#C9A227]" />
                )}
              </div>
              <div>
                <div className="text-xs font-medium text-[#EDE9E0]">Download HTML Site</div>
                <div className="text-[9px] text-[#666] mt-0.5">Self-contained .zip package</div>
              </div>
            </button>
          </div>

          {/* Export Full Markdown Bundle */}
          <div className="p-3 border-b border-[#1E1E1E]">
            <button
              onClick={handleExportBundle}
              disabled={exportingBundle}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#181818] transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#181818] flex items-center justify-center group-hover:bg-[#C9A227]/10 transition-colors">
                {exportingBundle ? (
                  <Loader2 className="w-4 h-4 text-[#C9A227] animate-spin" />
                ) : (
                  <Package className="w-4 h-4 text-[#C9A227]" />
                )}
              </div>
              <div>
                <div className="text-xs font-medium text-[#EDE9E0]">Export Source Bundle</div>
                <div className="text-[9px] text-[#666] mt-0.5">master.md, enhanced.md, CSV</div>
              </div>
            </button>
          </div>

          {/* One-click deploy */}
          <div className="p-3 border-b border-[#1E1E1E]">
            <div className="text-[9px] text-[#555] uppercase tracking-wider font-medium px-3 mb-2 font-mono">
              Hosting
            </div>
            <div className="space-y-1">
              <a
                href={vercelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#181818] transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-[#181818] flex items-center justify-center group-hover:bg-white/5 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="white">
                    <polygon points="12 2 24 21 0 21" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium text-[#EDE9E0]">Deploy to Vercel</div>
                  <div className="text-[9px] text-[#666]">Live web app link</div>
                </div>
                <ExternalLink className="w-3 h-3 text-[#555] ml-auto" />
              </a>
            </div>
          </div>

          {/* Copy live URL */}
          {slug && (
            <div className="p-3">
              <button
                onClick={handleCopyDeployUrl}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#181818] transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-[#181818] flex items-center justify-center group-hover:bg-[#C9A227]/10 transition-colors">
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#C9A227]" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-medium text-[#EDE9E0]">Copy Live URL</div>
                  <div className="text-[9px] text-[#666] mt-0.5 truncate max-w-[180px]">
                    {deployUrl || "artistsepks.com/epk/..."}
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      <AuthGateModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign Up to Deploy & Export"
        subtitle="Sign in or continue with Google, Spotify, or Apple to deploy your live website or download standalone HTML packages."
        redirectTo="/builder"
      />
    </div>
  );
}
