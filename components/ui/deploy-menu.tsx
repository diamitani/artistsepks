"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Download, Check, Copy, ExternalLink, Loader2, Rocket, Cloud } from "lucide-react";
import type { EPKData } from "@/lib/types";

interface Props {
  data: EPKData;
  slug?: string | null;
}

export function DeployMenu({ data, slug }: Props) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<{ url: string; message: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Export standalone HTML zip
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

  // Deploy to AWS Amplify
  const handleDeployAmplify = async () => {
    if (!data.artistName) return;
    setDeploying(true);

    try {
      // First get the HTML content
      const htmlRes = await fetch("/api/export/html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const htmlText = await htmlRes.text();

      // Deploy via AWS Amplify API
      const deployRes = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          epkSlug: slug || data.artistName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          artistName: data.artistName,
          htmlContent: htmlText,
        }),
      });

      const result = await deployRes.json();
      if (result.siteUrl || result.url) {
        setDeployResult({
          url: result.siteUrl || result.url,
          message: result.demo
            ? "Demo mode — configure AWS credentials for live deployment"
            : "Site deployed via AWS Amplify!",
        });
      }
    } catch (e) {
      console.error("Amplify deploy failed:", e);
    }
    setDeploying(false);
  };

  const handleCopyLink = () => {
    const url = slug
      ? `${window.location.origin}/epk/${slug}`
      : `${window.location.origin}/builder`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!data.artistName) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#333] text-[#888] text-[10px] font-medium tracking-wider uppercase hover:border-[#C9A227]/30 hover:text-[#C9A227] transition-all"
      >
        <Globe className="w-3 h-3" />
        Publish
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[#111] border border-[#222] rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1A1A1A]">
            <p className="text-xs font-medium text-[#EDE9E0] uppercase tracking-wider">Publish EPK</p>
            <p className="text-[10px] text-[#555] mt-0.5">Choose how to share your press kit</p>
          </div>

          <div className="p-2 space-y-1">
            {/* Copy hosted link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1A1A1A] transition-colors text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#C9A227]/10 flex items-center justify-center flex-shrink-0">
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#C9A227]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#C9A227]" />
                )}
              </div>
              <div>
                <p className="text-xs text-[#EDE9E0] font-medium">
                  {copied ? "Copied!" : "Copy Hosted Link"}
                </p>
                <p className="text-[10px] text-[#555]">Share at epks.artispreneur.com/epk/…</p>
              </div>
            </button>

            {/* Download PDF */}
            {slug && (
              <a
                href={`/api/pdf/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1A1A1A] transition-colors text-left block"
                onClick={() => setOpen(false)}
              >
                <div className="w-7 h-7 rounded-lg bg-[#C9A227]/10 flex items-center justify-center flex-shrink-0">
                  <Download className="w-3.5 h-3.5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-[#EDE9E0] font-medium">Download PDF</p>
                  <p className="text-[10px] text-[#555]">Print-ready for email & booking</p>
                </div>
              </a>
            )}

            {/* Download standalone HTML */}
            <button
              onClick={handleExportHtml}
              disabled={exporting}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1A1A1A] transition-colors text-left disabled:opacity-50"
            >
              <div className="w-7 h-7 rounded-lg bg-[#C9A227]/10 flex items-center justify-center flex-shrink-0">
                {exporting ? (
                  <Loader2 className="w-3.5 h-3.5 text-[#C9A227] animate-spin" />
                ) : (
                  <ExternalLink className="w-3.5 h-3.5 text-[#C9A227]" />
                )}
              </div>
              <div>
                <p className="text-xs text-[#EDE9E0] font-medium">
                  {exporting ? "Exporting..." : "Download HTML Site"}
                </p>
                <p className="text-[10px] text-[#555]">Self-host anywhere</p>
              </div>
            </button>

            {/* AWS Amplify deploy */}
            <button
              onClick={handleDeployAmplify}
              disabled={deploying}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1A1A1A] transition-colors text-left disabled:opacity-50"
            >
              <div className="w-7 h-7 rounded-lg bg-[#FF9900]/10 flex items-center justify-center flex-shrink-0">
                {deploying ? (
                  <Loader2 className="w-3.5 h-3.5 text-[#FF9900] animate-spin" />
                ) : (
                  <Cloud className="w-3.5 h-3.5 text-[#FF9900]" />
                )}
              </div>
              <div>
                <p className="text-xs text-[#EDE9E0] font-medium">
                  {deploying ? "Deploying..." : "Deploy via AWS Amplify"}
                </p>
                <p className="text-[10px] text-[#555]">Get your own .amplifyapp.com URL</p>
              </div>
            </button>

            {/* Deploy result */}
            {deployResult && (
              <div className="mx-3 mt-2 p-3 rounded-lg bg-[#0D1F0D] border border-green-900/30">
                <p className="text-[10px] text-green-400 font-medium mb-1">
                  {deployResult.message}
                </p>
                <a
                  href={deployResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-[#C9A227] break-all hover:underline"
                >
                  {deployResult.url}
                </a>
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-[#1A1A1A]">
            <p className="text-[9px] text-[#444] text-center">
              AWS Bedrock · Amplify · S3 · Artispreneur
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
