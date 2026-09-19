"use client";

import { useState } from "react";
import { Download, Loader2, FileText, Lock } from "lucide-react";
import type { EPKData } from "@/lib/types";
import { AuthGateModal } from "@/components/ui/auth-gate-modal";
import { createClient } from "@/lib/supabase/client";

interface Props {
  data: EPKData;
  disabled?: boolean;
  user?: unknown;
}

export function PdfDownload({ data, disabled, user }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleDownload = async () => {
    if (!data.artistName) return;

    // If user is not logged in, show Auth Gate Modal with OAuth
    if (!user) {
      try {
        const supabase = createClient();
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session?.user) {
          setShowAuthModal(true);
          return;
        }
      } catch {
        setShowAuthModal(true);
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/pdf/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "PDF generation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.artistName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-epk.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDownload}
          disabled={!data.artistName || loading || disabled}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#333] text-[#888] text-[10px] font-medium tracking-wider uppercase hover:border-[#C9A227]/30 hover:text-[#C9A227] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Download PDF"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <FileText className="w-3 h-3" />
          )}
          {loading ? "Rendering..." : "PDF"}
        </button>
        {error && (
          <span className="text-[9px] text-red-400 max-w-[120px] truncate">{error}</span>
        )}
      </div>

      <AuthGateModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign Up to Download Your Free PDF"
        subtitle="Sign in or continue with Google, Spotify, or Apple to download your high-resolution print-ready EPK PDF."
        redirectTo="/builder"
      />
    </>
  );
}
