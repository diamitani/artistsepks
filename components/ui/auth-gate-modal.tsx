"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  redirectTo?: string;
}

export function AuthGateModal({
  isOpen,
  onClose,
  title = "Create Your Free Account to Download",
  subtitle = "Sign in or create a free account with OAuth to download your EPK PDF, export source assets, and save your kit.",
  redirectTo = "/builder",
}: Props) {
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleOAuth(provider: "google" | "spotify" | "apple") {
    try {
      setOauthLoading(provider);
      setError("");
      const supabase = createClient();
      const { error: oAuthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (oAuthError) throw oAuthError;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `Failed to authenticate with ${provider}`);
      setOauthLoading(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-[#0e0e0e] border border-[#C9A227]/30 p-6 md:p-8 shadow-2xl relative text-[#EDE9E0]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#777] hover:text-white hover:bg-[#1a1a1a] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center mb-5 text-[#C9A227]">
          <Lock className="w-6 h-6" />
        </div>

        {/* Title & Copy */}
        <h3 className="font-display text-2xl uppercase tracking-wide text-white mb-2">
          {title}
        </h3>
        <p className="text-xs text-[#888] leading-relaxed mb-6">
          {subtitle}
        </p>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-xs text-red-300 mb-4">
            {error}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleOAuth("google")}
            disabled={!!oauthLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#181818] border border-[#333] hover:border-[#555] hover:bg-[#202020] text-xs font-semibold text-white flex items-center justify-center gap-3 transition-all disabled:opacity-50"
          >
            {oauthLoading === "google" ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#C9A227]" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4L1.6 7.1C.6 9.1 0 11.5 0 14.7s.6 5.6 1.6 7.6l3.7-2.9c-.2-.7-.4-1.5-.4-2.4z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16.4C3.5 20.2 7.4 23.5 12 23.5z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => handleOAuth("spotify")}
            disabled={!!oauthLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#181818] border border-[#333] hover:border-[#555] hover:bg-[#202020] text-xs font-semibold text-white flex items-center justify-center gap-3 transition-all disabled:opacity-50"
          >
            {oauthLoading === "spotify" ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#22C55E]" />
            ) : (
              <svg className="w-4 h-4 fill-[#22C55E]" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.307c-.216.353-.674.468-1.027.252-2.815-1.72-6.358-2.109-10.533-1.155-.404.093-.812-.162-.904-.566-.093-.404.162-.812.566-.904 4.571-1.045 8.492-.596 11.646 1.346.353.216.468.674.252 1.027zm1.464-3.259c-.271.442-.85.583-1.292.312-3.222-1.98-8.134-2.553-11.946-1.395-.499.152-1.026-.134-1.177-.633-.152-.499.134-1.026.633-1.177 4.364-1.325 9.775-.684 13.47 1.591.442.271.583.85.312 1.302zm.126-3.41c-3.864-2.294-10.246-2.506-13.93-1.387-.593.18-1.22-.158-1.4-.751-.18-.593.158-1.22.751-1.4 4.238-1.286 11.286-1.042 15.717 1.59.533.316.709 1.008.393 1.541-.316.533-1.008.709-1.541.393z" />
              </svg>
            )}
            <span>Continue with Spotify</span>
          </button>

          <button
            onClick={() => handleOAuth("apple")}
            disabled={!!oauthLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#181818] border border-[#333] hover:border-[#555] hover:bg-[#202020] text-xs font-semibold text-white flex items-center justify-center gap-3 transition-all disabled:opacity-50"
          >
            {oauthLoading === "apple" ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.75 1.04-1.8 1.01-2.84-.96.04-2.13.64-2.81 1.43-.59.68-1.11 1.76-1.01 2.8 1.07.08 2.19-.55 2.81-1.39z" />
              </svg>
            )}
            <span>Continue with Apple</span>
          </button>
        </div>

        {/* Email Sign Up Option */}
        <div className="pt-4 border-t border-[#1c1c1c] text-center">
          <Link
            href={`/auth/signup?redirectTo=${encodeURIComponent(redirectTo)}`}
            className="text-xs text-[#C9A227] hover:underline font-mono inline-flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" /> Or sign up with email and password <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
