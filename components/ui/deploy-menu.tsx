"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Download, Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import type { EPKData } from "@/lib/types";

interface Props {
  data: EPKData;
  slug?: string | null;
}

export function DeployMenu({ data, slug }: Props) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deployUrl, setDeployUrl] = useState("");
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

  const handleExportHtml = async () => {
    if (!data.artistName) return;
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

  const netlifyUrl = slug
    ? `https://app.netlify.com/start/deploy?repository=${encodeURIComponent("https://github.com/vercel/next.js/tree/canary/examples/hello-world")}`
    : "https://app.netlify.com";

  if (!data.artistName) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#333] text-[#888] text-[10px] font-medium tracking-wider uppercase hover:border-[#C9A227]/30 hover:text-[#C9A227] transition-colors"
      >
        <Globe className="w-3 h-3" />
        Deploy
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[280px] bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Export standalone */}
          <div className="p-3 border-b border-[#1E1E1E]">
            <button
              onClick={handleExportHtml}
              disabled={exporting}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#181818] transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#181818] flex items-center justify-center group-hover:bg-[#C9A227]/10 transition-colors">
                {exporting ? (
                  <Loader2 className="w-4 h-4 text-[#C9A227] animate-spin" />
                ) : (
                  <Download className="w-4 h-4 text-[#C9A227]" />
                )}
              </div>
              <div>
                <div className="text-xs font-medium text-[#EDE9E0]">Download Standalone HTML</div>
                <div className="text-[9px] text-[#666] mt-0.5">Self-contained .zip for any host</div>
              </div>
            </button>
          </div>

          {/* One-click deploy */}
          <div className="p-3 border-b border-[#1E1E1E]">
            <div className="text-[9px] text-[#555] uppercase tracking-wider font-medium px-3 mb-2">
              One-click Deploy
            </div>
            <div className="space-y-1.5">
              <a
                href={vercelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#181818] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#181818] flex items-center justify-center group-hover:bg-white/5 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
                    <polygon points="12 2 24 21 0 21" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium text-[#EDE9E0]">Vercel</div>
                  <div className="text-[9px] text-[#666] mt-0.5">Deploy in one click</div>
                </div>
                <ExternalLink className="w-3 h-3 text-[#555] ml-auto" />
              </a>
              <a
                href={netlifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#181818] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#181818] flex items-center justify-center group-hover:bg-[#00AD9F]/10 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#00AD9F">
                    <path d="M6.5 2L2 6.5V17.5L6.5 22H17.5L22 17.5V6.5L17.5 2H6.5Z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium text-[#EDE9E0]">Netlify</div>
                  <div className="text-[9px] text-[#666] mt-0.5">Deploy with Netlify</div>
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
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#181818] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#181818] flex items-center justify-center group-hover:bg-[#C9A227]/10 transition-colors">
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#C9A227]" />
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
    </div>
  );
}
